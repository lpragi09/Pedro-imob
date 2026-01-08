import { supabase } from '@/lib/supabase';
import { MapPin, Bed, Ruler, ArrowLeft, Phone, Calendar, Bath, Car, Mail, Instagram, Facebook } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      
      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto px-4 py-6 w-full">
        <Link href="/" className="inline-flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium">
          <ArrowLeft className="w-5 h-5" /> Voltar
        </Link>
      </div>

      {/* Conteúdo Principal (flex-1 para empurrar o rodapé se a tela for grande) */}
      <main className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-8 lg:gap-12 flex-1 w-full pb-20">
        
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

          {/* Grid de Características */}
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

      {/* FOOTER (ID: contato) */}
      <footer id="contato" className="bg-slate-900 text-slate-300 py-16 mt-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-3 gap-12">
          
          {/* Coluna 1 */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">ImobPrime</h3>
            <p className="text-sm leading-relaxed max-w-xs">
              Seu parceiro de confiança para compra, venda e aluguel de imóveis de alto padrão e oportunidades únicas.
            </p>
          </div>

          {/* Coluna 2 */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">Contatos</h3>
            <div className="flex flex-col gap-3 text-sm">
              <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition"><Phone className="w-4 h-4"/> (11) 99999-9999</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition"><Mail className="w-4 h-4"/> contato@imobprime.com.br</a>
              <a href="#" className="flex items-center gap-2 hover:text-blue-400 transition"><MapPin className="w-4 h-4"/> Av. Paulista, 1000 - SP</a>
            </div>
          </div>

          {/* Coluna 3 */}
          <div className="space-y-4">
            <h3 className="text-white text-lg font-bold">Redes Sociais</h3>
            <div className="flex gap-4">
              <a href="#" className="bg-slate-800 p-3 rounded-lg hover:bg-blue-600 hover:text-white transition"><Instagram className="w-5 h-5"/></a>
              <a href="#" className="bg-slate-800 p-3 rounded-lg hover:bg-blue-600 hover:text-white transition"><Facebook className="w-5 h-5"/></a>
            </div>
          </div>

        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-xs text-slate-500">
          © 2026 ImobPrime. Todos os direitos reservados.
        </div>
      </footer>

    </div>
  );
}