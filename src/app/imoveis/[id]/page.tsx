import { supabase } from '@/lib/supabase';
import { MapPin, Bed, Ruler, ArrowLeft, MessageCircle, Bath, Car, Instagram, Facebook } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/ImageGallery';

export const revalidate = 0;

async function getImovel(id: string) {
  try {
    const { data, error } = await supabase.from('imoveis').select('*').eq('id', id).single();
    if (error) return null;
    return data;
  } catch (e) {
    return null;
  }
}

type Props = { params: Promise<{ id: string }> };

export default async function DetalhesImovel({ params }: Props) {
  const { id } = await params;
  const imovel = await getImovel(id);

  if (!imovel) return notFound();

  const textoWhatsApp = encodeURIComponent(`Olá! Vi o imóvel "${imovel.titulo}" no site Terras Rurais e quero mais detalhes.`);
  const linkWhatsApp = `https://wa.me/5511999999999?text=${textoWhatsApp}`;

  return (
    <div className="min-h-screen bg-terras-bege text-terras-marrom font-sans flex flex-col selection:bg-terras-laranja selection:text-white">
      
      {/* Botão Voltar (Agora sem a barra marrom e sem a logo à direita) */}
      <div className="max-w-7xl mx-auto px-6 pt-10 pb-6 w-full">
        <Link href="/imoveis" className="inline-flex items-center gap-2 text-terras-marrom/60 hover:text-terras-laranja transition uppercase tracking-widest text-[10px] font-bold">
          <ArrowLeft className="w-4 h-4" /> Voltar ao acervo
        </Link>
      </div>

      {/* Conteúdo Principal */}
      <main className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 lg:gap-16 flex-1 w-full pb-20">
        
        {/* Galeria Responsiva */}
        <div className="h-[400px] md:h-[600px] bg-white rounded-lg overflow-hidden border border-terras-marrom/10 shadow-2xl relative group">
          <ImageGallery imagens={imovel.imagens} />
        </div>

        {/* Informações da Propriedade */}
        <div className="flex flex-col justify-center space-y-8">
          <div>
            <div className="flex items-center justify-between mb-6">
              <span className={`inline-block px-4 py-1 text-[10px] font-bold uppercase tracking-widest ${imovel.tipo === 'VENDA' ? 'bg-terras-marrom text-terras-bege' : 'bg-terras-amarelo text-terras-marrom'}`}>
                {imovel.tipo === 'VENDA' ? 'À Venda' : 'Aluguel'}
              </span>
              <span className="text-terras-verde-musgo font-medium flex items-center gap-2 text-xs uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-terras-laranja"/> {imovel.bairro && `${imovel.bairro}, `}{imovel.cidade}
              </span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-terras-marrom leading-tight mb-6">
              {imovel.titulo}
            </h1>
            
            <p className="text-lg text-terras-marrom/80 font-light leading-relaxed border-l-2 border-terras-laranja pl-6">
              {imovel.descricao}
            </p>
          </div>

          {/* Preço de Destaque */}
          <div className="text-4xl md:text-5xl font-serif font-bold text-terras-laranja">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(imovel.preco)}
          </div>

          {/* Grid de Atributos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-8 border-y border-terras-marrom/10">
            <div className="flex flex-col items-center p-4 bg-white border border-terras-marrom/5 rounded-lg shadow-sm">
              <Bed className="text-terras-verde-musgo w-6 h-6 mb-3"/>
              <p className="text-2xl font-bold text-terras-marrom">{imovel.quartos}</p>
              <p className="text-[10px] text-terras-marrom/50 uppercase tracking-widest font-bold">Quartos</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white border border-terras-marrom/5 rounded-lg shadow-sm">
              <Bath className="text-terras-verde-musgo w-6 h-6 mb-3"/>
              <p className="text-2xl font-bold text-terras-marrom">{imovel.banheiros || 1}</p>
              <p className="text-[10px] text-terras-marrom/50 uppercase tracking-widest font-bold">Banheiros</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white border border-terras-marrom/5 rounded-lg shadow-sm">
              <Car className="text-terras-verde-musgo w-6 h-6 mb-3"/>
              <p className="text-2xl font-bold text-terras-marrom">{imovel.vagas || 0}</p>
              <p className="text-[10px] text-terras-marrom/50 uppercase tracking-widest font-bold">Vagas</p>
            </div>
            <div className="flex flex-col items-center p-4 bg-white border border-terras-marrom/5 rounded-lg shadow-sm">
              <Ruler className="text-terras-verde-musgo w-6 h-6 mb-3"/>
              <p className="text-2xl font-bold text-terras-marrom">{imovel.area}</p>
              <p className="text-[10px] text-terras-marrom/50 uppercase tracking-widest font-bold">Área (m²)</p>
            </div>
          </div>

          {/* Botão de Contato WhatsApp */}
          <a 
            href={linkWhatsApp} 
            target="_blank" 
            className="group bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-5 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-green-900/10 hover:-translate-y-1"
          >
            <MessageCircle className="w-5 h-5" /> Falar com Corretor
          </a>
        </div>
      </main>

      {/* Footer (Terras Rurais) */}
      <footer className="bg-terras-marrom text-terras-bege py-20 border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12 text-sm font-light">
          <div className="col-span-1 md:col-span-2 space-y-6">
            <h3 className="text-2xl font-serif font-bold">
                <span className="text-terras-amarelo">Terras</span>Rurais
            </h3>
            <p className="text-terras-bege/60 max-w-sm">
              Conectando você às melhores oportunidades de investimento em terras rurais, sítios e fazendas.
            </p>
          </div>
          <div className="space-y-4">
            <h4 className="uppercase tracking-widest text-xs font-bold text-terras-amarelo">Redes Sociais</h4>
            <div className="flex gap-4">
               <a href="#" className="hover:text-terras-laranja transition flex items-center gap-2"><Instagram className="w-4 h-4"/> Instagram</a>
               <a href="#" className="hover:text-terras-laranja transition flex items-center gap-2"><Facebook className="w-4 h-4"/> Facebook</a>
            </div>
          </div>
        </div>
        <div className="text-center mt-20 text-[10px] text-terras-bege/30 uppercase tracking-widest">
          © 2026 Terras Rurais. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}