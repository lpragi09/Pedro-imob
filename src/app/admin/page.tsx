"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Trash2, Pencil, Loader2, X, Upload, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Imovel = {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  tipo: string;
  quartos: number;
  area: number;
  imagens: string[]; // AGORA É UMA LISTA DE STRINGS
};

export default function AdminPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [imovelEmEdicao, setImovelEmEdicao] = useState<Imovel | null>(null);

  useEffect(() => {
    carregarImoveis();
  }, []);

  async function carregarImoveis() {
    const { data } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    if (data) setImoveis(data);
  }

  // Função para subir MÚLTIPLAS imagens
  async function uploadImagens(files: FileList): Promise<string[]> {
    const urls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage.from('imoveis').upload(filePath, file);
      if (!error) {
        const { data } = supabase.storage.from('imoveis').getPublicUrl(filePath);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      const arquivos = (document.getElementById('inputArquivos') as HTMLInputElement).files;
      
      let urlsDasImagens = imovelEmEdicao?.imagens || [];

      // Se selecionou novas fotos, faz upload e adiciona/substitui
      if (arquivos && arquivos.length > 0) {
        const novasUrls = await uploadImagens(arquivos);
        // Se estiver editando e quiser SOMAR fotos: urlsDasImagens = [...urlsDasImagens, ...novasUrls];
        // Se quiser SUBSTITUIR tudo:
        urlsDasImagens = novasUrls; 
      } else if (urlsDasImagens.length === 0) {
        alert("Selecione pelo menos uma imagem.");
        setLoading(false);
        return;
      }

      const dados = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        preco: Number(formData.get('preco')),
        tipo: formData.get('tipo'),
        quartos: Number(formData.get('quartos')),
        area: Number(formData.get('area')),
        imagens: urlsDasImagens, // Salvando o array
        destaque: true,
      };

      if (imovelEmEdicao) {
        await supabase.from('imoveis').update(dados).eq('id', imovelEmEdicao.id);
        alert("Atualizado!");
      } else {
        await supabase.from('imoveis').insert([dados]);
        alert("Criado!");
      }

      setImovelEmEdicao(null);
      (event.target as HTMLFormElement).reset();
      await carregarImoveis(); 
      router.refresh();

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar.");
    } finally {
      setLoading(false);
    }
  }

  async function deletarImovel(id: number) {
    if (confirm("Excluir imóvel?")) {
      await supabase.from('imoveis').delete().eq('id', id);
      await carregarImoveis();
      router.refresh();
    }
  }

  function preencherFormulario(imovel: Imovel) {
    setImovelEmEdicao(imovel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {imovelEmEdicao ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h1>
            {imovelEmEdicao && (
              <button onClick={() => setImovelEmEdicao(null)} className="text-sm text-red-500 flex items-center gap-1 hover:underline">
                <X className="w-4 h-4" /> Cancelar
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título e Descrição */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Título</label>
              <input name="titulo" defaultValue={imovelEmEdicao?.titulo} required type="text" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Descrição</label>
              <input name="descricao" defaultValue={imovelEmEdicao?.descricao} required type="text" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900" />
            </div>

            {/* Preço, Tipo, Quartos, Área */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Preço (R$)</label>
                <input name="preco" defaultValue={imovelEmEdicao?.preco} required type="number" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Tipo</label>
                <select name="tipo" defaultValue={imovelEmEdicao?.tipo} className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900">
                  <option value="VENDA">Venda</option>
                  <option value="ALUGUEL">Aluguel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Quartos</label>
                <input name="quartos" defaultValue={imovelEmEdicao?.quartos} required type="number" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Área (m²)</label>
                <input name="area" defaultValue={imovelEmEdicao?.area} required type="number" className="w-full p-3 bg-slate-50 border border-slate-300 rounded-lg outline-none text-slate-900" />
              </div>
            </div>

            {/* Upload Múltiplo */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Fotos do Imóvel</label>
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition relative">
                <input 
                  id="inputArquivos" 
                  type="file" 
                  multiple // PERMITE VÁRIOS ARQUIVOS
                  accept="image/*" 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 font-medium">Clique para escolher várias imagens</p>
                <p className="text-xs text-slate-400 mt-1">Pressione Ctrl para selecionar mais de uma</p>
              </div>
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Save />} 
              Salvar Imóvel
            </button>
          </form>
        </div>

        {/* LISTA */}
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-200">
           <h2 className="text-xl font-bold text-slate-800 mb-4">Seus Imóveis</h2>
           <div className="space-y-4">
            {imoveis.map((imovel) => (
              <div key={imovel.id} className="flex justify-between p-4 border border-slate-100 rounded-lg gap-4">
                <div className="flex items-center gap-4">
                  {/* Mostra só a primeira foto como capa */}
                  <img src={imovel.imagens ? imovel.imagens[0] : ''} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                  <div>
                    <h3 className="font-bold text-slate-800">{imovel.titulo}</h3>
                    <p className="text-sm text-slate-500 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> {imovel.imagens?.length || 0} fotos</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={() => preencherFormulario(imovel)} className="p-2 bg-blue-100 text-blue-700 rounded"><Pencil className="w-4 h-4"/></button>
                   <button onClick={() => deletarImovel(imovel.id)} className="p-2 bg-red-100 text-red-700 rounded"><Trash2 className="w-4 h-4"/></button>
                </div>
              </div>
            ))}
           </div>
        </div>

      </div>
    </div>
  );
}