"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, MapPin } from 'lucide-react';

export function ImoveisFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Estados dos filtros (sem mudanças na lógica)
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

  // Classes base para inputs e selects (Fundo claro, texto marrom, borda e foco laranja)
  const inputClass = "w-full bg-terras-bege border border-terras-marrom/30 p-3 rounded-md text-sm outline-none focus:border-terras-laranja focus:ring-1 focus:ring-terras-laranja text-terras-marrom placeholder:text-terras-marrom/50 transition-all";
  const selectClass = "w-full bg-terras-bege border border-terras-marrom/30 p-3 rounded-md text-sm outline-none focus:border-terras-laranja focus:ring-1 focus:ring-terras-laranja text-terras-marrom text-center font-bold transition-all appearance-none cursor-pointer";

  return (
    // Container do filtro com fundo MARROM e texto BEGE
    <div className="bg-terras-marrom border border-terras-bege/10 p-6 rounded-lg shadow-xl sticky top-32 text-terras-bege">
      <div className="flex items-center gap-2 mb-6 text-terras-amarelo">
        <Filter className="w-5 h-5" />
        <span className="font-bold uppercase tracking-widest text-xs font-serif">Filtrar Propriedades</span>
      </div>

      <form onSubmit={aplicarFiltros} className="space-y-6">
        
        {/* Cidade */}
        <div>
          <label className="block text-xs font-bold text-terras-bege/80 uppercase mb-2">Localização (Cidade/Região)</label>
          <div className="relative">
             <input type="text" value={cidade} onChange={(e) => setCidade(e.target.value)} placeholder="Ex: Atibaia" className={inputClass} />
             <MapPin className="absolute right-3 top-3 w-4 h-4 text-terras-marrom/60" />
          </div>
        </div>

        {/* Tipo */}
        <div className="pt-4 border-t border-terras-bege/10">
          <label className="block text-xs font-bold text-terras-bege/80 uppercase mb-2">Tipo de Negócio</label>
          <div className="flex gap-2">
            {['VENDA', 'ALUGUEL'].map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipo(tipo === t ? '' : t)}
                // Botões de tipo com estilo novo
                className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider border rounded-md transition-all ${
                  tipo === t 
                    ? 'bg-terras-laranja border-terras-laranja text-terras-bege shadow-md' // Ativo
                    : 'bg-transparent border-terras-bege/30 text-terras-bege/70 hover:border-terras-bege/70 hover:text-terras-bege' // Inativo
                }`}
              >
                {t === 'VENDA' ? 'Comprar' : 'Arrendar'}
              </button>
            ))}
          </div>
        </div>

        {/* Faixa de Preço (Sliders Laranjas) */}
        <div className="space-y-4 pt-4 border-t border-terras-bege/10">
            <div>
              <div className="flex justify-between text-xs font-bold text-terras-bege/80 mb-2 uppercase">
                  <span>Mínimo</span>
                  <span className="text-terras-amarelo">{formatMoney(minPreco)}</span>
              </div>
              <input 
                  type="range" min="0" max="500000" step="1000" value={minPreco} onChange={(e) => setMinPreco(Number(e.target.value))} 
                  // Slider com cor de destaque laranja
                  className="w-full h-2 bg-terras-bege/20 rounded-lg appearance-none cursor-pointer accent-terras-laranja" 
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-terras-bege/80 mb-2 uppercase">
                  <span>Máximo</span>
                  <span className="text-terras-amarelo">{maxPreco === 5000000 ? 'Sem limite' : formatMoney(maxPreco)}</span>
              </div>
              <input 
                  type="range" min="0" max="5000000" step="50000" value={maxPreco} onChange={(e) => setMaxPreco(Number(e.target.value))} 
                  className="w-full h-2 bg-terras-bege/20 rounded-lg appearance-none cursor-pointer accent-terras-laranja" 
              />
            </div>
        </div>

        {/* Características (Selects) */}
        <div className="pt-4 border-t border-terras-bege/10 space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-terras-bege/80 uppercase mb-2 text-center">Quartos / Suítes</label>
                    <div className="relative">
                      <select value={quartos} onChange={(e) => setQuartos(e.target.value)} className={selectClass}>
                          <option value="">Todos</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                          <option value="5">5+</option>
                      </select>
                      {/* Ícone de seta para o select */}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-terras-marrom/60">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-terras-bege/80 uppercase mb-2 text-center">Banheiros</label>
                    <div className="relative">
                      <select value={banheiros} onChange={(e) => setBanheiros(e.target.value)} className={selectClass}>
                          <option value="">Todos</option>
                          <option value="1">1+</option>
                          <option value="2">2+</option>
                          <option value="3">3+</option>
                          <option value="4">4+</option>
                          <option value="5">5+</option>
                      </select>
                       <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-terras-marrom/60">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-terras-bege/80 uppercase mb-2">Vagas / Garagem</label>
                <div className="relative">
                  <select value={vagas} onChange={(e) => setVagas(e.target.value)} className={selectClass}>
                      <option value="">Qualquer quantidade</option>
                      <option value="1">1+</option>
                      <option value="2">2+</option>
                      <option value="3">3+</option>
                      <option value="4">4+</option>
                      <option value="5">5+</option>
                  </select>
                   <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-terras-marrom/60">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                      </div>
                </div>
            </div>
        </div>

        {/* Botão de Aplicar LARANJA */}
        <button type="submit" className="w-full bg-terras-laranja hover:bg-terras-amarelo text-terras-bege font-bold uppercase tracking-widest text-xs py-4 rounded-md transition-all shadow-lg shadow-terras-laranja/20 mt-6 hover:-translate-y-1">
          Aplicar Filtros
        </button>
        
        {(cidade || tipo || quartos || banheiros || vagas || minPreco > 0 || maxPreco < 5000000) && (
          // Botão de Limpar com borda clara
          <button type="button" onClick={limparFiltros} className="flex items-center justify-center gap-2 w-full border border-terras-bege/30 hover:bg-terras-bege/10 text-terras-bege/70 hover:text-terras-bege text-xs py-3 rounded-md transition-all">
            <X className="w-4 h-4" /> Limpar Filtros
          </button>
        )}
      </form>
    </div>
  );
}