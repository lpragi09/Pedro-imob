"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, MapPin } from 'lucide-react';

export function ImoveisFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados dos filtros
  const [cidade, setCidade] = useState(searchParams.get('cidade') || '');
  const [tipo, setTipo] = useState(searchParams.get('tipo') || '');
  const [quartos, setQuartos] = useState(searchParams.get('quartos') || '');
  const [banheiros, setBanheiros] = useState(searchParams.get('banheiros') || '');
  const [vagas, setVagas] = useState(searchParams.get('vagas') || '');
  
  const [minPreco, setMinPreco] = useState(Number(searchParams.get('min_preco')) || 0);
  const [maxPreco, setMaxPreco] = useState(Number(searchParams.get('max_preco')) || 5000000);

  useEffect(() => {
    setCidade(searchParams.get('cidade') || '');
    setTipo(searchParams.get('tipo') || '');
    setQuartos(searchParams.get('quartos') || '');
    setBanheiros(searchParams.get('banheiros') || '');
    setVagas(searchParams.get('vagas') || '');
    setMinPreco(Number(searchParams.get('min_preco')) || 0);
    setMaxPreco(Number(searchParams.get('max_preco')) || 5000000);
  }, [searchParams]);

  const formatMoney = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(val);

  const aplicarFiltros = (e?: React.FormEvent) => {
    e?.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    params.delete('busca'); 
    params.delete('page');

    if (cidade) params.set('cidade', cidade); else params.delete('cidade');
    if (tipo) params.set('tipo', tipo); else params.delete('tipo');
    if (quartos) params.set('quartos', quartos); else params.delete('quartos');
    if (banheiros) params.set('banheiros', banheiros); else params.delete('banheiros');
    if (vagas) params.set('vagas', vagas); else params.delete('vagas');
    
    if (minPreco > 0) params.set('min_preco', minPreco.toString()); 
    else params.delete('min_preco');
    
    if (maxPreco < 5000000) params.set('max_preco', maxPreco.toString());
    else params.delete('max_preco');

    router.push(`/imoveis?${params.toString()}`);
  };

  const limparFiltros = () => {
    setCidade('');
    setTipo('');
    setQuartos('');
    setBanheiros('');
    setVagas('');
    setMinPreco(0);
    setMaxPreco(5000000);
    router.push('/imoveis');
  };

  const inputClass = "w-full bg-slate-950 border border-slate-800 p-3 rounded-sm text-sm outline-none focus:border-yellow-600 text-slate-300 placeholder:text-slate-600 transition-colors";
  const selectClass = "w-full bg-slate-950 border border-slate-800 p-3 rounded-sm text-sm outline-none focus:border-yellow-600 text-slate-300 text-center font-bold transition-colors";

  return (
    <div className="bg-slate-900 border border-white/10 p-6 rounded-sm sticky top-32">
      <div className="flex items-center gap-2 mb-6 text-yellow-500">
        <Filter className="w-5 h-5" />
        <span className="font-bold uppercase tracking-widest text-xs">Filtrar Busca</span>
      </div>

      <form onSubmit={aplicarFiltros} className="space-y-6">
        
        {/* Cidade */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Localização (Cidade)</label>
          <div className="relative">
             <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: São Paulo" className={inputClass} />
             <MapPin className="absolute right-3 top-3 w-4 h-4 text-slate-600" />
          </div>
        </div>

        {/* Tipo */}
        <div className="pt-4 border-t border-white/5">
          <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo de Contrato</label>
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

        {/* Faixa de Preço */}
        <div className="space-y-4 pt-4 border-t border-white/5">
            
            {/* INPUT MÍNIMO */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                  <span>Mínimo</span>
                  <span className="text-yellow-500">{formatMoney(minPreco)}</span>
              </div>
              <input 
                  type="range" 
                  min="0" 
                  max="500000" // Reduzi para 500k para dar precisão no arrastar
                  step="1000" // Passo de 1.000 em 1.000
                  value={minPreco} 
                  onChange={(e) => setMinPreco(Number(e.target.value))} 
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
              />
            </div>

            {/* INPUT MÁXIMO */}
            <div>
              <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase">
                  <span>Máximo</span>
                  <span className="text-yellow-500">{maxPreco === 5000000 ? '+ R$ 5 mi' : formatMoney(maxPreco)}</span>
              </div>
              <input 
                  type="range" 
                  min="0" 
                  max="5000000" 
                  step="50000" 
                  value={maxPreco} 
                  onChange={(e) => setMaxPreco(Number(e.target.value))} 
                  className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-yellow-500" 
              />
            </div>
        </div>

        {/* Características */}
        <div className="pt-4 border-t border-white/5 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-center">Quartos</label>
                    <select value={quartos} onChange={(e) => setQuartos(e.target.value)} className={selectClass}>
                        <option value="">Todos</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2 text-center">Banheiros</label>
                    <select value={banheiros} onChange={(e) => setBanheiros(e.target.value)} className={selectClass}>
                        <option value="">Todos</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5+</option>
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Vagas de Garagem</label>
                <select value={vagas} onChange={(e) => setVagas(e.target.value)} className={selectClass}>
                    <option value="">Qualquer quantidade</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                </select>
            </div>
        </div>

        <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold uppercase tracking-widest text-xs py-3 rounded-sm transition shadow-lg shadow-yellow-900/20 mt-4">
          Aplicar Filtros
        </button>
        
        {(cidade || tipo || quartos || banheiros || vagas || minPreco > 0 || maxPreco < 5000000) && (
          <button type="button" onClick={limparFiltros} className="flex items-center justify-center gap-2 w-full border border-slate-700 hover:bg-slate-800 text-slate-400 text-xs py-3 rounded-sm transition">
            <X className="w-3 h-3" /> Limpar Filtros
          </button>
        )}
      </form>
    </div>
  );
}