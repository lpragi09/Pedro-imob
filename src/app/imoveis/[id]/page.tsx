import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { MapPin, Bed, Ruler, ArrowLeft, Image as ImageIcon, Bath, Car, Share2, MessageCircle } from 'lucide-react';
import { notFound } from 'next/navigation';

export const revalidate = 0;

const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(valor);
}

export default async function PaginaDetalheImovel({ params }: { params: Promise<{ id: string }> }) {
  // 1. Aguarda os parâmetros corretamente
  const { id } = await params;

  // 2. Tenta buscar no banco (sem validação de regex antes para evitar erros)
  const { data: imovel, error } = await supabase
    .from('imoveis')
    .select('*')
    .eq('id', id)
    .single();

  // 3. Se o banco der erro ou não achar nada, chama a página 404
  if (error || !imovel) {
    console.error("Erro ao buscar imóvel:", error); // Isso ajuda a ver o erro no log da Vercel
    return notFound();
  }

  // Prepara link do WhatsApp
  const textoWhatsApp = encodeURIComponent(`Olá! Gostaria de mais informações sobre o imóvel "${imovel.titulo}" que vi no site Terras Rurais.`);
  const linkWhatsApp = `https://wa.me/5511999999999?text=${textoWhatsApp}`; 

  return (
    <div className="min-h-screen bg-terras-bege text-terras-marrom font-sans pb-20">
      
      {/* Header Fixo */}
      <header className="bg-terras-marrom py-6 px-6 md:px-12 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <Link href="/imoveis" className="text-terras-bege/80 hover:text-terras-laranja transition flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Voltar ao Catálogo
        </Link>
        <h1 className="text-xl font-serif font-bold text-terras-bege hidden md:block">
          <span className="text-terras-amarelo">Terras</span>Rurais
        </h1>
      </header>

      {/* Galeria de Imagens */}
      <div className="h-[50vh] md:h-[65vh] bg-terras-marrom/5 relative">
         {imovel.imagens && imovel.imagens.length > 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 h-full gap-1 p-1">
             
             {/* Imagem Principal */}
             <div className="md:col-span-2 md:row-span-2 relative rounded-lg overflow-hidden group">
                <img src={imovel.imagens[0]} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={imovel.titulo} />
                <div className="absolute inset-0 bg-terras-marrom/10 group-hover:bg-transparent transition-colors"></div>
             </div>

             {/* Outras Imagens (Com a correção de tipo string/number) */}
             {imovel.imagens.slice(1, 5).map((img: string, index: number) => (
               <div key={index} className="relative rounded-lg overflow-hidden group hidden md:block">
                  <img src={img} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" alt={`Foto ${index + 2}`} />
                  <div className="absolute inset-0 bg-terras-marrom/10 group-hover:bg-transparent transition-colors"></div>
               </div>
             ))}

             {imovel.imagens.length < 2 && (
                 <div className="md:col-span-2 md:row-span-2 bg-terras-marrom/10 flex items-center justify-center text-terras-marrom/30 rounded-lg"><ImageIcon size={64} /></div>
              )}
           </div>
         ) : (
           <div className="w-full h-full flex items-center justify-center text-terras-marrom/30"><ImageIcon size={100} strokeWidth={1} /></div>
         )}

         <button className="absolute top-6 right-6 bg-white/90 p-3 rounded-full text-terras-marrom hover:text-terras-laranja shadow-lg transition-transform hover:scale-110 z-20">
            <Share2 className="w-5 h-5" />
         </button>
      </div>

      {/* Infos Principais */}
      <main className="max-w-5xl mx-auto px-6 md:px-12 -mt-20 relative z-30">
        <div className="bg-white rounded-xl p-8 md:p-12 shadow-2xl shadow-terras-marrom/10 border border-terras-marrom/5">
          
          <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
            <div>
               <span className={`inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4 shadow-sm ${imovel.tipo === 'VENDA' ? 'bg-terras-marrom text-terras-bege' : 'bg-terras-amarelo text-terras-marrom'}`}>
                  {imovel.tipo === 'VENDA' ? 'À Venda' : 'Para Arrendar'}
               </span>
               <h1 className="text-3xl md:text-5xl font-serif font-bold text-terras-marrom mb-3 leading-tight">{imovel.titulo}</h1>
               <p className="text-lg text-terras-verde-musgo flex items-center gap-2 font-medium">
                 <MapPin className="w-5 h-5 inline-block" /> {imovel.cidade}, {imovel.estado} {imovel.bairro && `— ${imovel.bairro}`}
               </p>
            </div>
            <div className="text-left md:text-right">
               <p className="text-sm text-terras-marrom/70 uppercase tracking-wider font-bold mb-1">Valor do Investimento</p>
               <p className="text-4xl md:text-5xl font-serif font-bold text-terras-laranja">{formatarPreco(imovel.preco)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8 border-y border-terras-marrom/10 mb-10">
             <div className="flex flex-col items-center justify-center p-4 bg-terras-bege/50 rounded-lg border border-terras-marrom/5">
                <Bed className="w-8 h-8 text-terras-verde-musgo mb-2" strokeWidth={1.5} />
                <span className="text-2xl font-bold text-terras-marrom">{imovel.quartos}</span>
                <span className="text-xs text-terras-marrom/70 uppercase tracking-widest">Dormitórios</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4 bg-terras-bege/50 rounded-lg border border-terras-marrom/5">
                <Bath className="w-8 h-8 text-terras-verde-musgo mb-2" strokeWidth={1.5} />
                <span className="text-2xl font-bold text-terras-marrom">{imovel.banheiros}</span>
                <span className="text-xs text-terras-marrom/70 uppercase tracking-widest">Banheiros</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4 bg-terras-bege/50 rounded-lg border border-terras-marrom/5">
                <Car className="w-8 h-8 text-terras-verde-musgo mb-2" strokeWidth={1.5} />
                <span className="text-2xl font-bold text-terras-marrom">{imovel.vagas}</span>
                <span className="text-xs text-terras-marrom/70 uppercase tracking-widest">Vagas</span>
             </div>
             <div className="flex flex-col items-center justify-center p-4 bg-terras-bege/50 rounded-lg border border-terras-marrom/5">
                <Ruler className="w-8 h-8 text-terras-verde-musgo mb-2" strokeWidth={1.5} />
                <span className="text-2xl font-bold text-terras-marrom">{imovel.area} <span className="text-sm">m²</span></span>
                <span className="text-xs text-terras-marrom/70 uppercase tracking-widest">Área Total</span>
             </div>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
             <div className="md:col-span-2 space-y-6">
                <h2 className="text-2xl font-serif font-bold text-terras-marrom">Sobre a Propriedade</h2>
                <div className="prose prose-lg prose-p:text-terras-marrom/80 max-w-none whitespace-pre-line leading-relaxed">
                   {imovel.descricao}
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-terras-bege p-8 rounded-xl border border-terras-marrom/10 sticky top-32 shadow-lg">
                   <h3 className="text-xl font-serif font-bold text-terras-marrom mb-2">Interessado?</h3>
                   <p className="text-terras-marrom/80 text-sm mb-6">Entre em contato agora mesmo para agendar uma visita e conhecer este imóvel.</p>
                   
                   <a 
                      href={linkWhatsApp} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 px-6 rounded-full shadow-lg shadow-green-900/10 transition-all hover:-translate-y-1 group mb-4"
                   >
                      <MessageCircle className="w-6 h-6 group-hover:animate-bounce" />
                      Conversar no WhatsApp
                   </a>
                   <p className="text-center text-xs text-terras-marrom/60">
                     Resposta rápida em horário comercial.
                   </p>
                </div>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}