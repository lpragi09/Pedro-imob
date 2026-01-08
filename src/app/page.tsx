import Link from 'next/link';
import { Search, MapPin, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export const revalidate = 0;

const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}

export default async function HomeImobiliaria() {
  const { data: imoveis } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      
      {/* HERO SECTION - Fundo Fixo (Parallax Simples) */}
      <div id="topo" className="relative h-screen w-full flex items-center justify-center bg-fixed bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2653&auto=format&fit=crop")' }}>
        {/* Camada Escura */}
        <div className="absolute inset-0 bg-black/50 z-0"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/0 via-slate-950/20 to-slate-950 z-0"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-6">
          <span className="text-yellow-500 font-bold tracking-[0.4em] uppercase text-xs md:text-sm animate-pulse">Exclusive Real Estate</span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl text-white font-serif leading-tight drop-shadow-2xl">
            A arte de <br/><span className="italic font-light text-slate-300">viver bem.</span>
          </h1>
          
          {/* Busca Estilizada */}
          <div className="mt-12 max-w-md mx-auto relative group">
             <div className="absolute -inset-1 bg-gradient-to-r from-yellow-600 to-yellow-400 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
             <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 rounded-full p-2 flex items-center">
                <MapPin className="text-slate-400 w-5 h-5 ml-4" />
                <input type="text" placeholder="Localização..." className="bg-transparent w-full px-4 py-2 outline-none text-white placeholder:text-slate-400 font-light" />
                <button className="bg-white text-black hover:bg-yellow-400 hover:text-black rounded-full p-3 transition-colors duration-300">
                   <ArrowRight className="w-5 h-5"/>
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* SEÇÃO IMÓVEIS */}
      <main id="imoveis" className="max-w-7xl mx-auto px-6 py-32 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="space-y-2">
            <span className="text-yellow-500 uppercase tracking-widest text-xs font-bold block">Curadoria</span>
            <h2 className="text-4xl md:text-5xl text-white font-serif">Acervo Selecionado</h2>
          </div>
          <Link href="/imoveis" className="text-slate-400 hover:text-white transition text-sm uppercase tracking-widest border-b border-transparent hover:border-yellow-500 pb-1">
            Ver Coleção Completa
          </Link>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(!imoveis || imoveis.length === 0) && (
             <p className="text-slate-500 col-span-3 text-center py-20 font-light italic">Nenhuma propriedade disponível no momento.</p>
          )}

          {imoveis?.map((imovel) => (
            <Link 
              href={`/imoveis/${imovel.id}`} 
              key={imovel.id} 
              className="glass-card group relative block h-[500px] w-full overflow-hidden rounded-sm cursor-pointer"
            >
              {/* Imagem com Zoom */}
              <div className="absolute inset-0 overflow-hidden">
                 {imovel.imagens && imovel.imagens.length > 0 ? (
                  <img src={imovel.imagens[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={imovel.titulo} />
                ) : (
                  <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-700"><ImageIcon size={48} /></div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent opacity-90 group-hover:opacity-70 transition-opacity duration-500"></div>
              </div>

              {/* Informações */}
              <div className="absolute bottom-0 left-0 w-full p-8 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 bg-white/10 text-white backdrop-blur-md mb-3 inline-block border border-white/10`}>
                  {imovel.tipo}
                </span>
                <h3 className="text-2xl text-white mb-2 font-serif group-hover:text-yellow-400 transition-colors">
                  {imovel.titulo}
                </h3>
                <p className="text-slate-400 font-light text-sm mb-4 line-clamp-1">{imovel.cidade} {imovel.bairro && `• ${imovel.bairro}`}</p>
                
                <div className="flex justify-between items-center border-t border-white/10 pt-4 opacity-70 group-hover:opacity-100 transition-opacity delay-100">
                   <div className="flex gap-4 text-xs text-slate-300 uppercase tracking-wider">
                      <span>{imovel.quartos} Quartos</span>
                      <span>{imovel.area} m²</span>
                   </div>
                   <span className="text-xl font-serif text-white">{formatarPreco(imovel.preco)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* SEÇÃO SOBRE */}
      <section id="sobre" className="py-32 bg-slate-900 relative border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">
          <div className="space-y-8">
            <span className="text-yellow-500 uppercase tracking-widest text-xs font-bold">Nossa Essência</span>
            <h2 className="text-4xl md:text-5xl text-white font-serif leading-tight">
              Mais do que morar,<br/> uma experiência.
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed">
              Redefinimos o conceito de alto padrão. Não vendemos apenas metros quadrados; fazemos a curadoria de cenários onde os melhores momentos da sua vida vão acontecer.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-4">
              <div>
                <h4 className="text-4xl font-serif text-white mb-1">10+</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Anos de Mercado</p>
              </div>
              <div>
                <h4 className="text-4xl font-serif text-white mb-1">R$ 500mi</h4>
                <p className="text-xs text-slate-500 uppercase tracking-widest">Em Vendas</p>
              </div>
            </div>
          </div>
          <div className="relative h-[600px] w-full">
            <img 
              src="https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2671&auto=format&fit=crop" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000" 
              alt="Interior de Luxo" 
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
              Sede Global<br/>
              Av. Brigadeiro Faria Lima, 9999<br/>
              São Paulo - SP
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-slate-400">Contato</h4>
            <p className="text-slate-300">(11) 99999-9999</p>
            <p className="text-slate-300">contato@imobprime.com</p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-slate-400">Social</h4>
            <div className="flex gap-4 text-slate-300">
              <a href="#" className="hover:text-yellow-500 transition">Instagram</a>
              <a href="#" className="hover:text-yellow-500 transition">LinkedIn</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-20 text-xs text-slate-800 uppercase tracking-widest">
          © 2026 ImobPrime Real Estate.
        </div>
      </footer>
    </div>
  );
}