import { supabase } from '@/lib/supabase';
import { MapPin, Bed, Ruler, ArrowLeft, Bath, Car } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ImageGallery } from '@/components/ImageGallery';
import { VideoGallery } from '@/components/VideoGallery';
import { WhatsAppButton } from '@/components/WhatsAppButton';
import { Footer } from '@/components/Footer';

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

  const textoWhatsApp = `Olá! Gostaria de saber sobre o imóvel "${imovel.titulo}".`;

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
        
        {/* Mídia (Fotos + Vídeos) */}
        <div className="space-y-6">
          <div className="h-[400px] md:h-[600px] bg-white rounded-lg overflow-hidden border border-terras-marrom/10 shadow-2xl relative group">
            <ImageGallery imagens={imovel.imagens} />
          </div>

          {Array.isArray(imovel.videos) && imovel.videos.length > 0 ? (
            <div className="bg-white rounded-lg border border-terras-marrom/10 shadow-lg p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-terras-marrom/70 mb-4">
                Vídeos
              </h3>
              <div className="rounded-lg overflow-hidden border border-terras-marrom/10 bg-black h-[260px] md:h-[320px]">
                <VideoGallery videos={imovel.videos as string[]} />
              </div>
            </div>
          ) : null}
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
          <WhatsAppButton 
            phone="553599227700"
            message={textoWhatsApp}
            variant="large"
          >
            Falar com Corretor
          </WhatsAppButton>
        </div>
      </main>

      <Footer />
    </div>
  );
}