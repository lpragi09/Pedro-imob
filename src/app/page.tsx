import Link from 'next/link';
import { Search, MapPin, Image as ImageIcon, Instagram, Facebook } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { Pagination } from '@/components/Pagination'; 

export const revalidate = 0;

const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}

export default async function HomeImobiliaria({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams;

  // --- LÓGICA DE PAGINAÇÃO ---
  const ITEMS_POR_PAGINA = 6;
  const paginaAtual = Number(params.page) || 1;
  const inicio = (paginaAtual - 1) * ITEMS_POR_PAGINA;
  const fim = inicio + ITEMS_POR_PAGINA - 1;

  // Query com limite (Range)
  const { data: imoveis, count } = await supabase
    .from('imoveis')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(inicio, fim); 

  const totalImoveis = count || 0;
  const totalPaginas = Math.ceil(totalImoveis / ITEMS_POR_PAGINA);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans">
      
      {/* HERO SECTION */}
      <div 
        id="topo" 
        className="relative h-screen w-full flex items-center justify-center bg-scroll md:bg-fixed bg-cover bg-center" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/20 to-slate-950 z-0"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-white font-serif leading-tight drop-shadow-2xl">
            Encontre o lugar que você <br/>sempre sonhou.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Especialistas em realizar sonhos e encontrar o lar perfeito para sua família.
          </p>
          
          <div className="mt-8 max-w-2xl mx-auto">
             <form action="/imoveis" className="relative bg-white/10 backdrop-blur-md border border-white/20 rounded-full p-2 flex items-center shadow-2xl">
                <MapPin className="text-slate-300 w-5 h-5 ml-4" />
                <input name="busca" type="text" placeholder="Qual cidade ou bairro?" className="bg-transparent w-full px-4 py-3 outline-none text-white placeholder:text-slate-400 font-sans text-base" />
                <button type="submit" className="bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition duration-300 flex items-center gap-2 shadow-lg shadow-yellow-900/20">
                   <Search className="w-4 h-4"/> Buscar
                </button>
             </form>
          </div>
        </div>
      </div>

      {/* SEÇÃO IMÓVEIS */}
      <main id="imoveis" className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <h2 className="text-4xl md:text-5xl text-white font-serif">Nossos Imóveis</h2>
            <p className="text-slate-400 font-light">Confira as novidades que acabaram de chegar</p>
          </div>
          <Link href="/imoveis" className="text-slate-400 hover:text-white transition text-sm uppercase tracking-widest border-b border-transparent hover:border-yellow-500 pb-1">
            Ver Todos
          </Link>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(!imoveis || imoveis.length === 0) && (
             <p className="text-slate-500 col-span-3 text-center py-20 font-light italic">Nenhum imóvel encontrado no momento.</p>
          )}

          {imoveis?.map((imovel) => (
            <Link 
              href={`/imoveis/${imovel.id}`} 
              key={imovel.id} 
              className="glass-card group relative block h-[500px] w-full overflow-hidden rounded-sm cursor-pointer"
            >
              <div className="absolute inset-0 overflow-hidden">
                 {imovel.imagens && imovel.imagens.length > 0 ? (
                  <img src={imovel.imagens[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={imovel.titulo} />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700"><ImageIcon size={48} /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
              </div>

              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/10 text-white backdrop-blur-md mb-3 inline-block border border-white/10`}>
                  {imovel.tipo}
                </span>
                <h3 className="text-2xl text-white mb-2 font-bold group-hover:text-yellow-400 transition-colors">
                  {imovel.titulo}
                </h3>
                <p className="text-slate-400 font-light text-sm mb-4 line-clamp-1">{imovel.cidade} {imovel.bairro && `• ${imovel.bairro}`}</p>
                
                <div className="flex justify-between items-center border-t border-white/10 pt-4 opacity-70 group-hover:opacity-100 transition-opacity delay-100">
                   <div className="flex gap-4 text-xs text-slate-300 uppercase tracking-wider">
                      <span>{imovel.quartos} Quartos</span>
                      <span>{imovel.area} m²</span>
                   </div>
                   {/* AQUI ESTÁ A MUDANÇA: Preço agora é text-yellow-500 */}
                   <span className="text-xl font-bold text-yellow-500">{formatarPreco(imovel.preco)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* --- PAGINAÇÃO NA HOME --- */}
        <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} />

      </main>

      {/* SEÇÃO SOBRE */}
      <section id="sobre" className="py-32 bg-slate-900 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl text-white font-serif leading-tight">
              Sobre a ImobPrime
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              Somos uma imobiliária dedicada a transformar a busca pelo imóvel ideal em uma experiência simples e segura. Com anos de mercado, focamos em atendimento personalizado para entender exatamente o que você e sua família precisam.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="text-4xl font-serif text-white mb-1">+500</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Famílias Felizes</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif text-white mb-1">10 Anos</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest">De História</p>
              </div>
            </div>
          </div>
          <div className="relative h-[500px] w-full">
            <img 
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" 
              className="w-full h-full object-cover transition-all duration-1000 rounded-sm" 
              alt="Escritório" 
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer id="contato" className="bg-black text-white py-20 border-t border-white/10">
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