"use client";

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X } from 'lucide-react';

export function ImoveisFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Pegamos os valores iniciais da URL ou definimos padrões
  const [tipo, setTipo] = useState(searchParams.get('tipo') || '');
  const [quartos, setQuartos] = useState(searchParams.get('quartos') || '');
  
  // Slider de Preço (Valores numéricos)
  const [minPreco, setMinPreco] = useState(Number(searchParams.get('min_preco')) || 0);
  const [maxPreco, setMaxPreco] = useState(Number(searchParams.get('max_preco')) || 5000000);

  // Formata o dinheiro (R$ 1.000,00)
  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  // Função que aplica o filtro
  const aplicarFiltros = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (tipo) params.set('tipo', tipo); else params.delete('tipo');
    if (quartos) params.set('quartos', quartos); else params.delete('quartos');
    
    if (minPreco > 0) params.set('min_preco', minPreco.toString()); 
    else params.delete('min_preco');
    
    // Se o maximo for menor que 5mi (limite do slider), aplica. Se for o máximo, remove pra não limitar.
    if (maxPreco < 5000000) params.set('max_preco', maxPreco.toString());
    else params.delete('max_preco');

    router.push(`/imoveis?${params.toString()}`);
  };

  return (
    <div className="bg-slate-900 border border-white/10 p-6 rounded-sm sticky top-32">
      <div className="flex items-center gap-2 mb-6 text-yellow-500">
        <Filter className="w-5 h-5" />
        <span className="font-bold uppercase tracking-widest text-xs">Filtrar Busca</span>
      </div>

      <form onSubmit={aplicarFiltros} className="space-y-8">
        
        {/* Tipo de Imóvel */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Tipo</label>
          <div className="flex gap-2">
            {['VENDA', 'ALUGUEL'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(tipo === t ? '' : t)}
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border transition ${
                  tipo === t 
                    ? 'bg-yellow-600 border-yellow-600 text-black' 
                    : 'bg-transparent border-slate-700 text-slate-400 hover:border-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Slider de Preço Mínimo */}
        <div>
           <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
              <span>Mínimo</span>
              <span className="text-yellow-500">{formatMoney(minPreco)}</span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="2000000" 
             step="50000" 
             value={minPreco}
             onChange={(e) => setMinPreco(Number(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400"
           />
        </div>

        {/* Slider de Preço Máximo */}
        <div>
           <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
              <span>Máximo</span>
              <span className="text-yellow-500">{maxPreco === 5000000 ? '+ R$ 5 mi' : formatMoney(maxPreco)}</span>
           </div>
           <input 
             type="range" 
             min="0" 
             max="5000000" 
             step="100000" 
             value={maxPreco}
             onChange={(e) => setMaxPreco(Number(e.target.value))}
             className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500 hover:accent-yellow-400"
           />
        </div>

        {/* Quartos */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-3">Quartos</label>
          <select 
            value={quartos} 
            onChange={(e) => setQuartos(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 p-3 rounded-sm text-sm outline-none focus:border-yellow-600 transition text-slate-300"
          >
            <option value="">Qualquer quantidade</option>
            <option value="2">2+ Quartos</option>
            <option value="3">3+ Quartos</option>
            <option value="4">4+ Quartos</option>
            <option value="5">5+ Quartos</option>
          </select>
        </div>

        {/* Botões */}
        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold uppercase tracking-widest text-xs py-3 rounded-sm transition shadow-lg shadow-yellow-900/20">
          Aplicar Filtros
        </button>
        
        {(tipo || quartos || minPreco > 0 || maxPreco < 5000000) && (
          <button 
            type="button"
            onClick={() => router.push('/imoveis')}
            className="flex items-center justify-center gap-2 w-full border border-slate-700 hover:bg-slate-800 text-slate-400 text-xs py-3 rounded-sm transition"
          >
            <X className="w-3 h-3" /> Limpar Filtros
          </button>
        )}
      </form>
    </div>
  );
}