import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Bed, Ruler, ArrowRight, Image as ImageIcon, Bath, Car, Instagram, Facebook } from 'lucide-react';
import { ImoveisFilter } from '@/components/ImoveisFilter';
import { Pagination } from '@/components/Pagination';

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
  
  // --- CONFIGURAÇÃO DA PAGINAÇÃO ---
  const ITEMS_POR_PAGINA = 6;
  const paginaAtual = Number(params.page) || 1;
  const inicio = (paginaAtual - 1) * ITEMS_POR_PAGINA;
  const fim = inicio + ITEMS_POR_PAGINA - 1;

  // Query Base
  let query = supabase.from('imoveis').select('*', { count: 'exact' }).order('created_at', { ascending: false });

  // --- APLICAÇÃO DOS FILTROS ---
  if (params.busca) {
    query = query.or(`titulo.ilike.%${params.busca}%,cidade.ilike.%${params.busca}%,bairro.ilike.%${params.busca}%`);
  }
  if (params.cidade) {
    query = query.ilike('cidade', `%${params.cidade}%`);
  }

  if (params.tipo) query = query.eq('tipo', params.tipo);

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
  
  if (params.min_preco) query = query.gte('preco', params.min_preco);
  if (params.max_preco) query = query.lte('preco', params.max_preco);

  // --- LIMITA A PÁGINA ATUAL ---
  query = query.range(inicio, fim);

  const { data: imoveis, count } = await query;

  // Cálculos Finais
  const totalImoveis = count || 0;
  const totalPaginas = Math.ceil(totalImoveis / ITEMS_POR_PAGINA);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col justify-between">
      
      {/* CONTEÚDO PRINCIPAL */}
      <div className="pt-28 pb-12 w-full">
        <div className="max-w-7xl mx-auto px-6">
            
            {/* Cabeçalho */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-white/10 pb-6 gap-4">
            <div>
                <span className="text-yellow-500 font-bold uppercase tracking-widest text-xs">Catálogo</span>
                <h1 className="text-3xl md:text-4xl font-serif text-white mt-2">Acervo Exclusivo</h1>
                <p className="text-slate-400 mt-2 font-light text-sm">
                Mostrando {imoveis?.length} de {totalImoveis} propriedades encontradas 
                {params.cidade && ` em "${params.cidade}"`}
                </p>
            </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
            
            {/* BARRA LATERAL */}
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

                {/* BARRA DE PAGINAÇÃO */}
                <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} />

            </div>
            </div>
        </div>
      </div>

      {/* FOOTER - ADICIONADO AQUI */}
      <footer id="contato" className="bg-black text-white py-20 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm font-light">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-serif">Imob<span className="text-yellow-600">Prime</span></h3>
            <p className="text-slate-500 max-w-sm">
              Seu parceiro de confiança para compra, venda e aluguel de imóveis de alto padrão e oportunidades únicas.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-slate-400">Contato</h4>
            <p className="text-slate-300">(11) 99999-9999</p>
            <p className="text-slate-300">contato@imobprime.com.br</p>
            <p className="text-slate-300">Av. Paulista, 1000 - SP</p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-slate-400">Redes Sociais</h4>
            <div className="flex gap-4 text-slate-300">
              <a href="#" className="hover:text-yellow-500 transition flex items-center gap-2"><Instagram className="w-4 h-4"/> Instagram</a>
              <a href="#" className="hover:text-yellow-500 transition flex items-center gap-2"><Facebook className="w-4 h-4"/> Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-20 text-xs text-slate-800 uppercase tracking-widest">
          © 2026 ImobPrime. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}