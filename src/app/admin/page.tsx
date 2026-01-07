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
  imagens: string[];
};

export default function AdminPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [imovelEmEdicao, setImovelEmEdicao] = useState<Imovel | null>(null);

  // NOVOS ESTADOS PARA O PREVIEW
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => {
    carregarImoveis();
  }, []);

  async function carregarImoveis() {
    const { data } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    if (data) setImoveis(data);
  }

  // FUNÇÃO MÁGICA: Pega o arquivo e cria o preview na tela
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const novosArquivos = Array.from(e.target.files);
      
      // Guarda os arquivos reais para upload
      setArquivosSelecionados((prev) => [...prev, ...novosArquivos]);

      // Cria URLs temporárias só para mostrar na tela agora
      const novasUrls = novosArquivos.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...novasUrls]);
    }
  };

  // Permite remover uma imagem que você selecionou sem querer antes de salvar
  const removerImagemDoPreview = (index: number) => {
    setArquivosSelecionados(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  async function uploadImagens(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error } = await supabase.storage.from('imoveis').upload(filePath, file);
      if (!error) {
        const { data } = supabase.storage.from('imoveis').getPublicUrl(filePath);
        urls.push(data.publicUrl);
      } else {
        console.error("Erro upload:", error);
      }
    }
    return urls;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.currentTarget);
      
      // Pega as imagens que já existiam (se for edição)
      let urlsFinais = imovelEmEdicao?.imagens || [];

      // Se tiver novos arquivos selecionados, faz o upload deles
      if (arquivosSelecionados.length > 0) {
        const novasUrls = await uploadImagens(arquivosSelecionados);
        // Junta as antigas com as novas
        urlsFinais = [...urlsFinais, ...novasUrls];
      }

      // Validação: Precisa ter pelo menos uma imagem no total
      if (urlsFinais.length === 0) {
        alert("O imóvel precisa ter pelo menos uma foto.");
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
        imagens: urlsFinais,
        destaque: true,
      };

      if (imovelEmEdicao) {
        await supabase.from('imoveis').update(dados).eq('id', imovelEmEdicao.id);
        alert("Imóvel atualizado!");
      } else {
        await supabase.from('imoveis').insert([dados]);
        alert("Imóvel cadastrado!");
      }

      // Limpa tudo
      setImovelEmEdicao(null);
      setArquivosSelecionados([]);
      setPreviewUrls([]);
      (event.target as HTMLFormElement).reset();
      
      await carregarImoveis(); 
      router.refresh();

    } catch (error) {
      console.error(error);
      alert("Erro ao salvar. Verifique o console.");
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
    setArquivosSelecionados([]); // Limpa arquivos novos ao editar
    setPreviewUrls([]); // Limpa previews
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
              <button onClick={() => { setImovelEmEdicao(null); setPreviewUrls([]); setArquivosSelecionados([]); }} className="text-sm text-red-500 flex items-center gap-1 hover:underline">
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

            {/* ÁREA DE UPLOAD COM PREVIEW */}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Fotos do Imóvel</label>
              
              {/* Box de Seleção */}
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition relative mb-4">
                <input 
                  type="file" 
                  multiple 
                  accept="image/*" 
                  onChange={handleImageChange} // AQUI ESTÁ A MÁGICA
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                />
                <Upload className="w-8 h-8 text-slate-400 mb-2" />
                <p className="text-sm text-slate-500 font-medium">Clique para adicionar fotos</p>
              </div>

              {/* Grid de Previews (Mostra o que você selecionou) */}
              {(previewUrls.length > 0 || (imovelEmEdicao && imovelEmEdicao.imagens)) && (
                <div className="grid grid-cols-4 gap-2">
                  {/* Mostra fotos antigas se estiver editando */}
                  {imovelEmEdicao?.imagens?.map((img, idx) => (
                    <div key={`old-${idx}`} className="relative h-24 rounded-lg overflow-hidden border border-slate-200">
                      <img src={img} className="w-full h-full object-cover opacity-50" />
                      <span className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] w-full text-center">Já salva</span>
                    </div>
                  ))}

                  {/* Mostra fotos novas que você acabou de selecionar */}
                  {previewUrls.map((url, idx) => (
                    <div key={`new-${idx}`} className="relative h-24 rounded-lg overflow-hidden border-2 border-blue-500">
                      <img src={url} className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removerImagemDoPreview(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2">
              {loading ? <Loader2 className="animate-spin" /> : <Save />} 
              {imovelEmEdicao ? 'Salvar Alterações' : 'Cadastrar Imóvel'}
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