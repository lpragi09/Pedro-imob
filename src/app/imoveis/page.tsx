import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Bed, Ruler, ArrowRight, Image as ImageIcon, Bath, Car } from 'lucide-react';
import { ImoveisFilter } from '@/components/ImoveisFilter';

export const revalidate = 0;

const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}

export default async function PaginaImoveis({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;
  
  // Construção da Query
  let query = supabase.from('imoveis').select('*').order('created_at', { ascending: false });

  // Filtros de Texto
  if (params.busca) {
    query = query.or(`titulo.ilike.%${params.busca}%,cidade.ilike.%${params.busca}%,bairro.ilike.%${params.busca}%`);
  }
  if (params.cidade) {
    query = query.ilike('cidade', `%${params.cidade}%`);
  }

  // Tipo
  if (params.tipo) query = query.eq('tipo', params.tipo);

  // LOGICA NOVA: Exata para 1-4, "5+" para 5.
  if (params.quartos) {
    if (params.quartos === '5') query = query.gte('quartos', 5);
    else query = query.eq('quartos', params.quartos);
  }

  if (params.banheiros) {
    if (params.banheiros === '5') query = query.gte('banheiros', 5);
    else query = query.eq('banheiros', params.banheiros);
  }

  if (params.vagas) {
    if (params.vagas === '5') query = query.gte('vagas', 5);
    else query = query.eq('vagas', params.vagas);
  }
  
  // Preço
  if (params.min_preco) query = query.gte('preco', params.min_preco);
  if (params.max_preco) query = query.lte('preco', params.max_preco);

  const { data: imoveis } = await query;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs">Catálogo</span>
            <h1 className="text-3xl md:text-4xl font-serif text-white mt-2">Acervo Exclusivo</h1>
            <p className="text-slate-400 mt-2 font-light text-sm">
              {imoveis?.length} propriedades encontradas {params.busca && `para "${params.busca}"`} {params.cidade && `em "${params.cidade}"`}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          <aside className="lg:col-span-1">
            <ImoveisFilter />
          </aside>

          {/* GRADE DE IMÓVEIS */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {(!imoveis || imoveis.length === 0) && (
                <div className="col-span-2 py-20 text-center border border-dashed border-slate-800 rounded-sm bg-slate-900/50">
                  <p className="text-xl text-slate-500 font-serif">Nenhum imóvel encontrado.</p>
                  <p className="text-sm text-slate-600 mt-2">Tente ajustar os filtros de preço ou localização.</p>
                </div>
              )}

              {imoveis?.map((imovel) => (
                <Link 
                  href={`/imoveis/${imovel.id}`} 
                  key={imovel.id} 
                  className="bg-slate-900 border border-white/5 hover:border-yellow-600/50 group block overflow-hidden rounded-sm transition-all duration-300 hover:shadow-2xl hover:shadow-black/50"
                >
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
                      <div className="w-full h-full bg-slate-800 flex items-center justify-center text-slate-600"><ImageIcon /></div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>
                  </div>
                  
                  <div className="p-6">
                    <div className="mb-4">
                       <h3 className="text-xl font-bold text-white group-hover:text-yellow-500 transition line-clamp-1">{imovel.titulo}</h3>
                       <p className="text-xs text-slate-500 uppercase tracking-wider flex items-center gap-1 mt-1">
                         <MapPin className="w-3 h-3" /> {imovel.bairro || imovel.cidade}
                       </p>
                    </div>

                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-slate-400 border-y border-white/5 py-3 mb-4">
                       <span className="flex items-center gap-1"><Bed className="w-4 h-4 text-slate-600"/> {imovel.quartos} Quartos</span>
                       <span className="flex items-center gap-1"><Bath className="w-4 h-4 text-slate-600"/> {imovel.banheiros} Banheiros</span>
                       <span className="flex items-center gap-1"><Car className="w-4 h-4 text-slate-600"/> {imovel.vagas} Vagas</span>
                       <span className="flex items-center gap-1"><Ruler className="w-4 h-4 text-slate-600"/> {imovel.area}m²</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-yellow-500">
                        {formatarPreco(imovel.preco)}
                      </span>
                      <ArrowRight className="text-slate-600 w-5 h-5 group-hover:text-white group-hover:translate-x-1 transition" />
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