"use client"; // Importante para formulários

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Loader2 } from 'lucide-react';

export default function AdminPanel() {
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState('');

  // Função que envia para o Supabase
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMensagem('');

    const formData = new FormData(event.currentTarget);
    const dados = {
      titulo: formData.get('titulo'),
      descricao: formData.get('descricao'),
      preco: Number(formData.get('preco')),
      tipo: formData.get('tipo'), // VENDA ou ALUGUEL
      quartos: Number(formData.get('quartos')),
      area: Number(formData.get('area')),
      imagem_url: formData.get('imagem_url'),
      destaque: true, // Por padrão vamos destacar
    };

    const { error } = await supabase.from('imoveis').insert([dados]);

    if (error) {
      setMensagem('Erro ao cadastrar: ' + error.message);
    } else {
      setMensagem('Imóvel cadastrado com sucesso!');
      (event.target as HTMLFormElement).reset(); // Limpa o formulário
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          Painel Administrativo
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Título */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Título do Anúncio</label>
            <input name="titulo" required type="text" placeholder="Ex: Casa Linda no Centro" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Descrição Curta</label>
            <input name="descricao" required type="text" placeholder="Ex: Próximo a escolas e mercados" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
          </div>

          {/* Preço e Tipo */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Preço (R$)</label>
              <input name="preco" required type="number" placeholder="0.00" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tipo</label>
              <select name="tipo" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500">
                <option value="VENDA">Venda</option>
                <option value="ALUGUEL">Aluguel</option>
              </select>
            </div>
          </div>

          {/* Detalhes */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quartos</label>
              <input name="quartos" required type="number" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Área (m²)</label>
              <input name="area" required type="number" className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            </div>
          </div>

          {/* Imagem */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">URL da Foto</label>
            <input name="imagem_url" required type="url" placeholder="https://..." className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-blue-500" />
            <p className="text-xs text-slate-400 mt-1">Dica: Use links do Unsplash ou hospede a imagem em algum lugar.</p>
          </div>

          {/* Botão de Salvar */}
          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Save />} 
            {loading ? 'Salvando...' : 'Cadastrar Imóvel'}
          </button>

          {/* Mensagem de Sucesso/Erro */}
          {mensagem && (
            <div className={`p-4 rounded-lg text-center font-medium ${mensagem.includes('Erro') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
              {mensagem}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}