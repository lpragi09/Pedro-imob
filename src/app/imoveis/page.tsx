import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { Search, MapPin, Bed, Ruler, Filter, X } from 'lucide-react';

export const revalidate = 0; // Garante que sempre mostre dados novos

const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}

// Essa função recebe os parametros da URL (ex: ?busca=sp&quartos=3)
export default async function PaginaImoveis({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  
  // 1. Começa a query base
  let query = supabase.from('imoveis').select('*').order('created_at', { ascending: false });

  // 2. Aplica os filtros se eles existirem na URL
  if (params.busca) {
    // Busca no titulo, cidade ou bairro
    query = query.or(`titulo.ilike.%${params.busca}%,cidade.ilike.%${params.busca}%,bairro.ilike.%${params.busca}%`);
  }
  if (params.tipo) {
    query = query.eq('tipo', params.tipo);
  }
  if (params.quartos) {
    query = query.gte('quartos', params.quartos); // gte = maior ou igual
  }
  if (params.min_preco) {
    query = query.gte('preco', params.min_preco);
  }
  if (params.max_preco) {
    query = query.lte('preco', params.max_preco);
  }

  // 3. Busca os dados finais
  const { data: imoveis } = await query;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabeçalho da Página */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-white">Acervo Exclusivo</h1>
            <p className="text-slate-400 mt-2 font-light">
              {imoveis?.length} propriedades encontradas {params.busca && `para "${params.busca}"`}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* BARRA LATERAL DE FILTROS (Formulário) */}
          <aside className="lg:col-span-1">
            <div className="bg-slate-900 border border-white/10 p-6 rounded-sm sticky top-32">
              <div className="flex items-center gap-2 mb-6 text-yellow-500">
                <Filter className="w-5 h-5" />
                <span className="font-bold uppercase tracking-widest text-xs">Filtrar Busca</span>
              </div>

              <form className="space-y-6">
                {/* Mantém a busca textual se já tiver */}
                <input type="hidden" name="busca" value={params.busca || ''} />

                {/* Tipo de Imóvel */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Tipo</label>
                  <select name="tipo" defaultValue={params.tipo} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-sm text-sm outline-none focus:border-yellow-600 transition">
                    <option value="">Todos</option>
                    <option value="VENDA">Venda</option>
                    <option value="ALUGUEL">Aluguel</option>
                  </select>
                </div>

                {/* Quartos */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mínimo de Quartos</label>
                  <select name="quartos" defaultValue={params.quartos} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-sm text-sm outline-none focus:border-yellow-600 transition">
                    <option value="">Qualquer</option>
                    <option value="2">2+ Quartos</option>
                    <option value="3">3+ Quartos</option>
                    <option value="4">4+ Quartos</option>
                  </select>
                </div>

                {/* Faixa de Preço */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Preço Min</label>
                    <input name="min_preco" type="number" placeholder="0" defaultValue={params.min_preco} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-sm text-sm outline-none focus:border-yellow-600" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase mb-2">Preço Max</label>
                    <input name="max_preco" type="number" placeholder="Max" defaultValue={params.max_preco} className="w-full bg-slate-950 border border-slate-800 p-3 rounded-sm text-sm outline-none focus:border-yellow-600" />
                  </div>
                </div>

                {/* Botões de Ação */}
                <button type="submit" className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold uppercase tracking-widest text-xs py-3 rounded-sm transition">
                  Aplicar Filtros
                </button>
                
                {(params.busca || params.tipo || params.quartos || params.min_preco) && (
                  <Link href="/imoveis" className="flex items-center justify-center gap-2 w-full border border-slate-700 hover:bg-slate-800 text-slate-400 text-xs py-3 rounded-sm transition mt-2">
                    <X className="w-3 h-3" /> Limpar Filtros
                  </Link>
                )}
              </form>
            </div>
          </aside>

          {/* GRADE DE IMÓVEIS */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(!imoveis || imoveis.length === 0) && (
                <div className="col-span-2 py-20 text-center border border-dashed border-slate-800 rounded-sm">
                  <p className="text-xl text-slate-500 font-serif">Nenhum imóvel encontrado.</p>
                  <p className="text-sm text-slate-600 mt-2">Tente ajustar os filtros para ver mais resultados.</p>
                </div>
              )}

              {imoveis?.map((imovel) => (
                <Link 
                  href={`/imoveis/${imovel.id}`} 
                  key={imovel.id} 
                  className="bg-slate-900 border border-white/5 hover:border-yellow-600/50 group block overflow-hidden rounded-sm transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                >
                  {/* Imagem */}
                  <div className="h-64 overflow-hidden relative">
                    <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 z-10 uppercase tracking-widest text-black ${imovel.tipo === 'VENDA' ? 'bg-white' : 'bg-yellow-500'}`}>
                      {imovel.tipo}
                    </span>
                    
                    {imovel.imagens && imovel.imagens.length > 0 ? (
                      <img 
                        src={imovel.imagens[0]} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" 
                        alt={imovel.titulo} 
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600">Sem Foto</div>
                    )}
                    
                    {/* Gradiente Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                  </div>
                  
                  {/* Conteúdo do Card */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                         <h3 className="text-xl font-serif text-white group-hover:text-yellow-500 transition line-clamp-1">{imovel.titulo}</h3>
                         <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1 mt-1">
                           <MapPin className="w-3 h-3" /> {imovel.bairro}
                         </p>
                      </div>
                    </div>

                    <div className="flex gap-4 text-xs text-slate-400 border-y border-white/5 py-3 mb-4">
                       <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-slate-600"/> {imovel.quartos} Quartos</span>
                       <span className="flex items-center gap-1"><Ruler className="w-4 h-4 text-slate-600"/> {imovel.area}m²</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-serif text-yellow-500">
                        {formatarPreco(imovel.preco)}
                      </span>
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition">
                        Ver Detalhes &rarr;
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}