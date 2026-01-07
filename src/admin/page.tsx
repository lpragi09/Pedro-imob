"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Trash2, Pencil, Loader2, PlusCircle, X } from 'lucide-react';

// Definindo o tipo do Imóvel para o TypeScript não reclamar
type Imovel = {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  tipo: string;
  quartos: number;
  area: number;
  imagem_url: string;
};

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [imovelEmEdicao, setImovelEmEdicao] = useState<Imovel | null>(null); // Estado para edição

  // Carregar imóveis ao abrir a página
  useEffect(() => {
    carregarImoveis();
  }, []);

  async function carregarImoveis() {
    const { data } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    if (data) setImoveis(data);
  }

  // Função de Salvar (Cria ou Atualiza)
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const dados = {
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      preco: Number(formData.get('preco')),
      tipo: formData.get('tipo'),
      quartos: Number(formData.get('quartos')),
      area: Number(formData.get('area')),
      imagem_url: formData.get('imagem_url'),
      destaque: true,
    };

    if (imovelEmEdicao) {
      // ATUALIZAR (UPDATE)
      await supabase.from('imoveis').update(dados).eq('id', imovelEmEdicao.id);
      alert("Imóvel atualizado!");
    } else {
      // CRIAR NOVO (INSERT)
      await supabase.from('imoveis').insert([dados]);
      alert("Imóvel cadastrado!");
    }

    setImovelEmEdicao(null); // Limpa modo edição
    (event.target as HTMLFormElement).reset(); // Limpa form
    carregarImoveis(); // Recarrega a lista
    setLoading(false);
  }

  async function deletarImovel(id: number) {
    if (confirm("Tem certeza que deseja excluir este imóvel?")) {
      await supabase.from('imoveis').delete().eq('id', id);
      carregarImoveis();
    }
  }

  function preencherFormulario(imovel: Imovel) {
    setImovelEmEdicao(imovel);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola pra cima pra editar
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* FORMULÁRIO */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              {imovelEmEdicao ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h1>
            {imovelEmEdicao && (
              <button onClick={() => setImovelEmEdicao(null)} className="text-sm text-red-500 flex items-center gap-1 hover:underline">
                <X className="w-4 h-4" /> Cancelar Edição
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Título</label>
              <input name="titulo" defaultValue={imovelEmEdicao?.titulo} required type="text" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>

            {/* Descrição */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Descrição</label>
              <input name="descricao" defaultValue={imovelEmEdicao?.descricao} required type="text" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>

            {/* Grid de Preço e Tipo */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
                <input name="preco" defaultValue={imovelEmEdicao?.preco} required type="number" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
                <select name="tipo" defaultValue={imovelEmEdicao?.tipo} className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500">
                  <option value="VENDA">Venda</option>
                  <option value="ALUGUEL">Aluguel</option>
                </select>
              </div>
            </div>

            {/* Grid Detalhes */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Quartos</label>
                <input name="quartos" defaultValue={imovelEmEdicao?.quartos} required type="number" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Área (m²)</label>
                <input name="area" defaultValue={imovelEmEdicao?.area} required type="number" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
              </div>
            </div>

            {/* Imagem */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">URL da Foto</label>
              <input name="imagem_url" defaultValue={imovelEmEdicao?.imagem_url} required type="url" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>

            <button disabled={loading} type="submit" className={`w-full font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 text-white ${imovelEmEdicao ? 'bg-orange-500 hover:bg-orange-600' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {loading ? <Loader2 className="animate-spin" /> : <Save />} 
              {imovelEmEdicao ? 'Atualizar Imóvel' : 'Cadastrar Imóvel'}
            </button>
          </form>
        </div>

        {/* LISTA DE IMÓVEIS EXISTENTES */}
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200">
          <h2 className="text-xl font-bold text-slate-800 mb-4">Gerenciar Imóveis ({imoveis.length})</h2>
          
          <div className="space-y-4">
            {imoveis.map((imovel) => (
              <div key={imovel.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-slate-100 rounded-lg hover:bg-slate-50 gap-4">
                <div className="flex items-center gap-4">
                  <img src={imovel.imagem_url} className="w-16 h-16 rounded-lg object-cover bg-slate-200" />
                  <div>
                    <h3 className="font-bold text-slate-800">{imovel.titulo}</h3>
                    <p className="text-sm text-slate-500">R$ {imovel.preco} • {imovel.tipo}</p>
                  </div>
                </div>
                
                <div className="flex gap-2 w-full md:w-auto">
                  <button onClick={() => preencherFormulario(imovel)} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition text-sm font-bold">
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                  <button onClick={() => deletarImovel(imovel.id)} className="flex-1 md:flex-none flex items-center justify-center gap-1 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition text-sm font-bold">
                    <Trash2 className="w-4 h-4" /> Excluir
                  </button>
                </div>
              </div>
            ))}
            
            {imoveis.length === 0 && <p className="text-center text-slate-500 py-8">Nenhum imóvel cadastrado.</p>}
          </div>
        </div>

      </div>
    </div>
  );
}