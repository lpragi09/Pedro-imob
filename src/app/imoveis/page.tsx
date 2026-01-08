import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Bed, Ruler, ArrowRight, Image as ImageIcon, Bath, Car, Instagram, Facebook } from 'lucide-react';
import { ImoveisFilter } from '@/components/ImoveisFilter';
import { Pagination } from '@/components/Pagination';

// Garante que a página sempre busque dados novos do banco
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

  // --- CONSTRUÇÃO DA QUERY NO SUPABASE ---
  let query = supabase.from('imoveis').select('*', { count: 'exact' }).order('created_at', { ascending: false });

  // Filtros de Texto
  if (params.busca) query = query.or(`titulo.ilike.%${params.busca}%,cidade.ilike.%${params.busca}%,bairro.ilike.%${params.busca}%`);
  if (params.cidade) query = query.ilike('cidade', `%${params.cidade}%`);
  
  // Filtros de Seleção
  if (params.tipo) query = query.eq('tipo', params.tipo);
  
  // Filtros Numéricos (Lógica para "5+" ou valor exato)
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

  // Filtro de Preço
  if (params.min_preco) query = query.gte('preco', params.min_preco);
  if (params.max_preco) query = query.lte('preco', params.max_preco);

  // Aplica a paginação na query
  query = query.range(inicio, fim);

  // Executa a busca
  const { data: imoveis, count } = await query;
  
  const totalImoveis = count || 0;
  const totalPaginas = Math.ceil(totalImoveis / ITEMS_POR_PAGINA);

  return (
    <div className="min-h-screen bg-terras-bege text-terras-marrom font-sans flex flex-col justify-between">
      
      {/* ID="IMOVEIS" é importante aqui! 
          Quando a pessoa clica na página 2, o site rola automaticamente até aqui.
      */}
      <div id="imoveis" className="pt-28 pb-12 w-full relative scroll-mt-24">
        <div className="absolute top-0 left-0 w-full h-64 bg-terras-marrom/5 z-0"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
            
            {/* Cabeçalho da Página */}
            <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-terras-marrom/10 pb-6 gap-4">
              <div>
                  <span className="text-terras-laranja font-bold uppercase tracking-widest text-xs font-serif">Catálogo</span>
                  <h1 className="text-3xl md:text-4xl font-serif text-terras-marrom mt-2">Acervo Rural</h1>
                  <p className="text-terras-marrom/70 mt-2 font-light text-sm">
                  Mostrando {imoveis?.length} de {totalImoveis} propriedades encontradas 
                  {params.cidade && ` em "${params.cidade}"`}
                  </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-8">
            
              {/* Coluna da Esquerda: FILTROS */}
              <aside className="lg:col-span-1">
                  <ImoveisFilter />
              </aside>

              {/* Coluna da Direita: LISTA DE IMÓVEIS */}
              <div className="lg:col-span-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Caso não ache nada */}
                    {(!imoveis || imoveis.length === 0) && (
                        <div className="col-span-2 py-20 text-center border-2 border-dashed border-terras-marrom/20 rounded-lg bg-terras-marrom/5">
                          <p className="text-xl text-terras-marrom font-serif mb-2">Nenhuma propriedade encontrada.</p>
                          <p className="text-sm text-terras-verde-musgo">Tente ajustar os filtros de localização ou valor.</p>
                        </div>
                    )}

                    {/* Lista os Cards */}
                    {imoveis?.map((imovel) => (
                        <Link 
                        href={`/imoveis/${imovel.id}`} 
                        key={imovel.id} 
                        className="group block bg-white border border-terras-marrom/10 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-terras-marrom/10 hover:-translate-y-1"
                        >
                        <div className="h-64 overflow-hidden relative">
                            {/* Tag de Tipo */}
                            <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 z-10 uppercase tracking-widest rounded-full shadow-sm ${imovel.tipo === 'VENDA' ? 'bg-terras-marrom text-terras-bege' : 'bg-terras-amarelo text-terras-marrom'}`}>
                              {imovel.tipo === 'VENDA' ? 'Venda' : 'Aluguel'}
                            </span>
                            
                            {/* Imagem do Card */}
                            {imovel.imagens && imovel.imagens.length > 0 ? (
                            <img src={imovel.imagens[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={imovel.titulo} />
                            ) : (
                            <div className="w-full h-full bg-terras-bege flex items-center justify-center text-terras-marrom/50"><ImageIcon /></div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-terras-marrom/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <div className="p-6">
                            <h3 className="text-xl text-terras-marrom mb-2 font-bold font-serif group-hover:text-terras-laranja transition-colors line-clamp-1">
                              {imovel.titulo}
                            </h3>
                            <p className="text-terras-verde-musgo font-medium text-sm mb-4 flex items-center gap-1">
                              <MapPin className="w-4 h-4 inline" /> {imovel.bairro || imovel.cidade}
                            </p>

                            <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-terras-marrom/80 border-y border-terras-marrom/10 py-4 mb-4">
                              <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-terras-verde-musgo"/> {imovel.quartos} Quartos</span>
                              <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-terras-verde-musgo"/> {imovel.banheiros} Banheiros</span>
                              <span className="flex items-center gap-2"><Car className="w-4 h-4 text-terras-verde-musgo"/> {imovel.vagas} Vagas</span>
                              <span className="flex items-center gap-2"><Ruler className="w-4 h-4 text-terras-verde-musgo"/> {imovel.area}m²</span>
                            </div>

                            <div className="flex items-center justify-between">
                              <span className="text-2xl font-bold text-terras-laranja font-serif">
                                  {formatarPreco(imovel.preco)}
                              </span>
                              <ArrowRight className="text-terras-marrom/60 w-5 h-5 group-hover:text-terras-laranja group-hover:translate-x-1 transition" />
                            </div>
                        </div>
                        </Link>
                    ))}
                  </div>
                  
                  {/* PAGINAÇÃO: Só aparece se houver mais de 1 página */}
                  <div className="mt-8">
                    <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} />
                  </div>

              </div>
            </div>
        </div>
      </div>

      {/* Rodapé da Página */}
      <footer id="contato" className="bg-[#3a281d] text-terras-bege py-20 border-t border-terras-bege/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm font-light">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-3xl font-serif font-bold flex items-center gap-2">
              <span className="text-terras-amarelo">Terras</span>Rurais
            </h3>
            <p className="text-terras-bege/70 max-w-sm">
              Seu parceiro de confiança para compra, venda e arrendamento de imóveis rurais. Conectando você ao melhor do campo.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-terras-amarelo">Contato</h4>
            <p className="text-terras-bege/90">(11) 99999-9999</p>
            <p className="text-terras-bege/90">contato@terrasrurais.com.br</p>
            <p className="text-terras-bege/90">Rodovia dos Bandeirantes, km 50 - SP</p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-terras-amarelo">Redes Sociais</h4>
            <div className="flex gap-4 text-terras-bege/90">
              <a href="#" className="hover:text-terras-laranja transition flex items-center gap-2"><Instagram className="w-5 h-5"/> Instagram</a>
              <a href="#" className="hover:text-terras-laranja transition flex items-center gap-2"><Facebook className="w-5 h-5"/> Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-20 text-xs text-terras-bege/50 uppercase tracking-widest pt-8 border-t border-terras-bege/5">
          © 2026 Terras Rurais. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}