import { supabase } from '@/lib/supabase';
import { MapPin, Bed, Ruler, ArrowLeft, Phone, Bath, Car, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import { ImageGallery } from '@/components/ImageGallery';

async function getImovel(id: string) {
  const { data } = await supabase.from('imoveis').select('*').eq('id', id).single();
  return data;
}

type Props = { params: Promise<{ id: string }> };

export default async function DetalhesImovel({ params }: Props) {
  const { id } = await params;
  const imovel = await getImovel(id);

  if (!imovel) return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Imóvel não encontrado</div>;

  const textoWhatsApp = `Olá! Vi o imóvel "${imovel.titulo}" no site e quero mais detalhes.`;
  const linkWhatsApp = `https://wa.me/5511999999999?text=${encodeURIComponent(textoWhatsApp)}`;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col selection:bg-yellow-500 selection:text-black">
      
      {/* Botão Voltar (COM CORREÇÃO DE ESPAÇAMENTO: pt-28) */}
      <div className="max-w-7xl mx-auto px-6 pt-28 pb-6 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white transition uppercase tracking-widest text-xs font-bold">
          <ArrowLeft className="w-4 h-4" /> Voltar para o acervo
        </Link>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-16 flex-1 w-full pb-20">
        
        {/* Galeria */}
        <div className="h-[400px] md:h-[600px] bg-slate-900 rounded-sm overflow-hidden border border-white/10 shadow-2xl relative group">
          <ImageGallery imagens={imovel.imagens} />
          <div className="absolute inset-0 border border-white/5 pointer-events-none"></div>
        </div>

        {/* Informações */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className={`inline-block px-4 py-1 text-xs font-bold uppercase tracking-widest text-black ${imovel.tipo === 'VENDA' ? 'bg-white' : 'bg-yellow-500'}`}>
                {imovel.tipo}
              </span>
              <span className="text-slate-400 font-light flex items-center gap-2 text-sm uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-yellow-600"/> {imovel.bairro}, {imovel.cidade}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif text-white leading-tight mb-6">
              {imovel.titulo}
            </h1>
            <p className="text-lg text-slate-400 font-light leading-relaxed border-l-2 border-yellow-600 pl-6">
              {imovel.descricao}
            </p>
          </div>

          <div className="text-4xl md:text-5xl font-serif text-yellow-500">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.preco)}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-white/10">
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-sm hover:border-yellow-500/30 transition duration-500">
              <Bed className="text-slate-300 w-6 h-6 mb-3"/>
              <p className="text-2xl font-serif text-white">{imovel.quartos}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Quartos</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-sm hover:border-yellow-500/30 transition duration-500">
              <Bath className="text-slate-300 w-6 h-6 mb-3"/>
              <p className="text-2xl font-serif text-white">{imovel.banheiros || 1}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Banheiros</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-sm hover:border-yellow-500/30 transition duration-500">
              <Car className="text-slate-300 w-6 h-6 mb-3"/>
              <p className="text-2xl font-serif text-white">{imovel.vagas || 0}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Vagas</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white/5 backdrop-blur-sm border border-white/5 rounded-sm hover:border-yellow-500/30 transition duration-500">
              <Ruler className="text-slate-300 w-6 h-6 mb-3"/>
              <p className="text-2xl font-serif text-white">{imovel.area}</p>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Área (m²)</p>
            </div>
          </div>

          <a href={linkWhatsApp} target="_blank" className="group bg-white hover:bg-yellow-500 text-black px-8 py-5 rounded-sm font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(234,179,8,0.4)]">
            <Phone className="w-4 h-4" /> Tenho Interesse
            <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition" />
          </a>
        </div>
      </main>

      {/* FOOTER */}
      <footer id="contato" className="bg-black text-white py-20 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm font-light">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-serif">Imob<span className="text-yellow-600">Prime</span></h3>
            <p className="text-slate-500 max-w-sm">
              Seu parceiro de confiança para compra, venda e aluguel de imóveis de alto padrão.
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