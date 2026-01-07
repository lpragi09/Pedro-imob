import { supabase } from '@/lib/supabase';
import { MapPin, Bed, Ruler, ArrowLeft, Phone, Calendar, Bath, Car } from 'lucide-react';
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

  if (!imovel) return <div>Não encontrado</div>;

  const textoWhatsApp = `Olá! Vi o imóvel "${imovel.titulo}" no site e quero mais detalhes.`;
  const linkWhatsApp = `https://wa.me/5511999999999?text=${encodeURIComponent(textoWhatsApp)}`;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </Link>
      </div>

      <main className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 lg:gap-12">
        
        {/* Galeria */}
        <div className="h-[400px] md:h-[500px] bg-slate-200 rounded-3xl overflow-hidden shadow-xl">
          <ImageGallery imagens={imovel.imagens} />
        </div>

        {/* Informações Completas */}
        <div className="flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className={`inline-block px-4 py-1 rounded-full text-xs font-bold text-white ${imovel.tipo === 'VENDA' ? 'bg-green-500' : 'bg-blue-500'}`}>
                {imovel.tipo}
              </span>
              <span className="text-slate-500 font-medium flex items-center gap-1 text-sm">
                <MapPin className="w-4 h-4"/> {imovel.bairro}, {imovel.cidade}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">{imovel.titulo}</h1>
            <p className="text-lg text-slate-600 mt-4 leading-relaxed">{imovel.descricao}</p>
          </div>

          <div className="text-4xl font-black text-blue-600">
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(imovel.preco)}
          </div>

          {/* Grid de Características (Ouro do Imóvel) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-y border-slate-200">
            
            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Bed className="text-blue-600 w-6 h-6 mb-2"/>
              <p className="text-2xl font-black text-slate-900">{imovel.quartos}</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Quartos</p>
            </div>

            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Bath className="text-blue-600 w-6 h-6 mb-2"/>
              <p className="text-2xl font-black text-slate-900">{imovel.banheiros || 1}</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Banheiros</p>
            </div>

            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Car className="text-blue-600 w-6 h-6 mb-2"/>
              <p className="text-2xl font-black text-slate-900">{imovel.vagas || 0}</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Vagas</p>
            </div>

            <div className="flex flex-col items-center p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <Ruler className="text-blue-600 w-6 h-6 mb-2"/>
              <p className="text-2xl font-black text-slate-900">{imovel.area}</p>
              <p className="text-xs text-slate-400 font-bold uppercase">Área (m²)</p>
            </div>

          </div>

          <a href={linkWhatsApp} target="_blank" className="bg-green-500 hover:bg-green-600 text-white p-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-green-500/20 transition hover:scale-[1.02]">
            <Phone className="w-6 h-6" /> Tenho Interesse
          </a>
        </div>
      </main>
    </div>
  );
}