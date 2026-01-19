import Link from 'next/link';
import { Search, MapPin, Image as ImageIcon, Instagram, Facebook, ArrowRight, Bed, Bath, Car, Ruler } from 'lucide-react';
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
    <div className="min-h-screen bg-terras-bege text-terras-marrom font-sans">
      
      {/* HERO SECTION - Banner Rural */}
      <div 
        id="topo" 
        // Troquei a imagem por uma de fazenda
        className="relative h-screen w-full flex items-center justify-center bg-scroll md:bg-fixed bg-cover bg-center" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2664&auto=format&fit=crop")' }}
      >
        {/* Degradê agora é marrom */}
        <div className="absolute inset-0 bg-terras-marrom/40 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-terras-marrom/0 via-terras-marrom/30 to-terras-bege z-0"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          {/* Título agora é na cor bege claro para destacar */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl text-terras-bege font-serif leading-tight drop-shadow-2xl">
            Encontre sua terra,<br/>seu refúgio no campo.
          </h1>
          <p className="text-terras-bege/90 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Especialistas em conectar você às melhores propriedades rurais, sítios e fazendas da região.
          </p>
          
          <div className="mt-8 max-w-2xl mx-auto">
             {/* Barra de busca com cores novas */}
             <form action="/imoveis" className="relative bg-terras-bege/90 backdrop-blur-md border border-terras-marrom/20 rounded-full p-2 flex items-center shadow-2xl shadow-terras-marrom/10">
                <MapPin className="text-terras-marrom w-5 h-5 ml-4" />
                <input name="busca" type="text" placeholder="Qual cidade ou região?" className="bg-transparent w-full px-4 py-3 outline-none text-terras-marrom placeholder:text-terras-marrom/60 font-sans text-base" />
                {/* Botão de busca agora é LARANJA */}
                <button type="submit" className="bg-terras-laranja hover:bg-terras-amarelo text-terras-bege px-8 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition duration-300 flex items-center gap-2 shadow-lg shadow-terras-laranja/20">
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
            <h2 className="text-4xl md:text-5xl text-terras-marrom font-serif">Propriedades em Destaque</h2>
            <p className="text-terras-verde-musgo font-light">Confira as novidades que acabaram de chegar</p>
          </div>
          <Link href="/imoveis" className="text-terras-marrom hover:text-terras-laranja transition text-sm uppercase tracking-widest border-b border-transparent hover:border-terras-laranja pb-1 font-bold">
            Ver Todas
          </Link>
        </div>

        {/* GRID DE CARDS - NOVO ESTILO RÚSTICO */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(!imoveis || imoveis.length === 0) && (
             <p className="text-terras-marrom/70 col-span-3 text-center py-20 font-light italic">Nenhuma propriedade encontrada no momento.</p>
          )}

          {imoveis?.map((imovel) => (
            <Link 
              href={`/imoveis/${imovel.id}`} 
              key={imovel.id} 
              // Card agora tem fundo branco/bege, borda sutil e sombra suave
              className="group block bg-white border border-terras-marrom/10 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-terras-marrom/10 hover:-translate-y-1"
            >
              <div className="h-72 overflow-hidden relative">
                 {/* Tag de Tipo com cores da logo */}
                 <span className={`absolute top-4 left-4 text-[10px] font-bold px-3 py-1 z-10 uppercase tracking-widest rounded-full shadow-sm ${imovel.tipo === 'VENDA' ? 'bg-terras-marrom text-terras-bege' : 'bg-terras-amarelo text-terras-marrom'}`}>
                  {imovel.tipo}
                </span>

                 {imovel.imagens && imovel.imagens.length > 0 ? (
                  <img src={imovel.imagens[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={imovel.titulo} />
                ) : (
                  <div className="w-full h-full bg-terras-bege flex items-center justify-center text-terras-marrom/50"><ImageIcon size={48} /></div>
                )}
                {/* Degradê sutil na base da imagem */}
                <div className="absolute inset-0 bg-gradient-to-t from-terras-marrom/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-6">
                <h3 className="text-xl text-terras-marrom mb-2 font-bold font-serif group-hover:text-terras-laranja transition-colors line-clamp-1">
                  {imovel.titulo}
                </h3>
                <p className="text-terras-verde-musgo font-medium text-sm mb-4 flex items-center gap-1">
                  <MapPin className="w-4 h-4 inline" /> {imovel.cidade} {imovel.bairro && `• ${imovel.bairro}`}
                </p>
                
                {/* Ícones com a cor verde musgo */}
                <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-terras-marrom/80 border-y border-terras-marrom/10 py-4 mb-4">
                    <span className="flex items-center gap-2"><Bed className="w-4 h-4 text-terras-verde-musgo"/> {imovel.quartos} Quartos</span>
                    <span className="flex items-center gap-2"><Bath className="w-4 h-4 text-terras-verde-musgo"/> {imovel.banheiros} Banheiros</span>
                    <span className="flex items-center gap-2"><Car className="w-4 h-4 text-terras-verde-musgo"/> {imovel.vagas} Vagas</span>
                    <span className="flex items-center gap-2"><Ruler className="w-4 h-4 text-terras-verde-musgo"/> {imovel.area}m²</span>
                </div>

                <div className="flex justify-between items-center">
                   {/* Preço em LARANJA */}
                   <span className="text-2xl font-bold text-terras-laranja font-serif">{formatarPreco(imovel.preco)}</span>
                   <ArrowRight className="text-terras-marrom/60 w-5 h-5 group-hover:text-terras-laranja group-hover:translate-x-1 transition" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* PAGINAÇÃO (Os estilos serão atualizados no componente) */}
        <Pagination paginaAtual={paginaAtual} totalPaginas={totalPaginas} caminho="/" />

      </main>

      {/* SEÇÃO SOBRE - Fundo Marrom */}
      <section id="sobre" className="py-32 bg-terras-marrom text-terras-bege relative">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-serif leading-tight">
              Sobre a Terras Rurais
            </h2>
            <p className="text-terras-bege/80 text-lg font-light leading-relaxed">
              Somos apaixonados pelo campo e dedicados a conectar pessoas às suas raízes. Entendemos as necessidades únicas de quem busca uma propriedade para produzir, viver ou descansar. Nossa missão é oferecer um atendimento personalizado e transparente em cada etapa do processo.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="text-4xl font-serif text-terras-amarelo mb-1">100%</h4>
                <p className="text-xs text-terras-bege/70 uppercase tracking-widest">Dedicação ao Cliente</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif text-terras-amarelo mb-1">24/7</h4>
                <p className="text-xs text-terras-bege/70 uppercase tracking-widest">Atendimento Disponível</p>
              </div>
            </div>
          </div>
          {/* Imagem da seção Sobre */}
          <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-2xl shadow-black/20">
            <img 
              src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=2070&auto=format&fit=crop" // Imagem de estrada rural
              className="w-full h-full object-cover" 
              alt="Paisagem Rural" 
            />
          </div>
        </div>
      </section>

      {/* FOOTER - Fundo Marrom Escuro */}
      <footer id="contato" className="bg-[#3a281d] text-terras-bege py-20 border-t border-terras-bege/10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm font-light">
          <div className="col-span-1 md:col-span-2 space-y-6">
            {/* Logo em texto (pode ser substituída pela imagem depois) */}
            <h3 className="text-3xl font-serif font-bold flex items-center gap-2">
              <span className="text-terras-amarelo">Terras</span>Rurais
            </h3>
            <p className="text-terras-bege/70 max-w-sm">
              Seu parceiro de confiança para compra, venda e arrendamento de imóveis rurais. Conectando você ao melhor do campo.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-terras-amarelo">Contato</h4>
            <a 
              href="https://wa.me/553599227700" 
              target="_blank"
              rel="noopener noreferrer"
              className="text-terras-bege/90 hover:text-terras-laranja transition block"
            >
              (35) 9922-7700
            </a>
            <a 
              href="mailto:contato@terrasrurais.com.br"
              className="text-terras-bege/90 hover:text-terras-laranja transition block"
            >
              contato@terrasrurais.com.br
            </a>
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