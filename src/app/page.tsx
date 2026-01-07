import { Search, MapPin, Key, Instagram, Facebook, Mail, Phone } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export default async function HomeImobiliaria() {
  
  const { data: imoveis } = await supabase
    .from('imoveis')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* HERO SECTION (ID: topo) */}
      <div id="topo" className="relative bg-slate-900 py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/80 z-10"></div>
           <img src="https://images.unsplash.com/photo-1600596542815-e32870110274?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-50" alt="Casa moderna" />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Encontre o lugar que você <br/>sempre sonhou.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
            Especialistas em realizar sonhos e encontrar o lar perfeito para sua família.
          </p>

          <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-black/20 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 mt-8">
            <div className="flex-1 flex items-center px-4 bg-slate-100 rounded-xl">
              <MapPin className="text-slate-400 w-5 h-5 mr-3" />
              <input type="text" placeholder="Qual cidade ou bairro?" className="bg-transparent w-full py-4 outline-none text-slate-700 font-medium placeholder:text-slate-400" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition">
              <Search className="w-5 h-5" /> Buscar
            </button>
          </div>
        </div>
      </div>

      {/* SEÇÃO IMÓVEIS (ID: imoveis) */}
      <main id="imoveis" className="max-w-7xl mx-auto px-4 py-20">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Nossos Imóveis</h2>
            <p className="text-slate-500 mt-2">Confira as novidades que acabaram de chegar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(!imoveis || imoveis.length === 0) && (
            <p className="text-slate-500 col-span-3 text-center py-10">Carregando imóveis...</p>
          )}

          {imoveis?.map((imovel) => (
            <div key={imovel.id} className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer">
              <div className="h-64 overflow-hidden relative">
                <span className={`absolute top-4 left-4 text-white text-xs font-bold px-3 py-1 rounded-full z-10 ${imovel.tipo === 'VENDA' ? 'bg-green-500' : 'bg-blue-500'}`}>
                  {imovel.tipo}
                </span>
                <img src={imovel.imagem_url} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" alt={imovel.titulo} />
              </div>
              <div className="p-6">
                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-sm text-slate-500 font-medium line-clamp-1">{imovel.descricao}</span>
                  <span className="text-blue-600 font-black text-xl shrink-0 ml-2">
                    {formatarPreco(imovel.preco)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1">{imovel.titulo}</h3>
                <div className="flex gap-4 text-slate-500 text-sm border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1"><Key className="w-4 h-4"/> {imovel.quartos} Quartos</span>
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> {imovel.area}m²</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* SEÇÃO SOBRE (ID: sobre) */}
      <section id="sobre" className="bg-slate-100 py-20">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Sobre a ImobPrime</h2>
            <p className="text-slate-600 leading-relaxed">
              Somos uma imobiliária dedicada a transformar a busca pelo imóvel ideal em uma experiência simples e segura. 
              Com anos de mercado, focamos em atendimento personalizado para entender exatamente o que você e sua família precisam.
            </p>
            <div className="grid grid-cols-2 gap-4 pt-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="text-2xl font-black text-blue-600">+500</h4>
                <p className="text-sm text-slate-500">Famílias Felizes</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <h4 className="text-2xl font-black text-blue-600">10 Anos</h4>
                <p className="text-sm text-slate-500">De História</p>
              </div>
            </div>
          </div>
          <div className="h-80 rounded-2xl overflow-hidden shadow-xl">
            <img src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80" className="w-full h-full object-cover" alt="Escritório" />
          </div>
        </div>
      </section>

      {/* FOOTER / CONTATO (ID: contato) */}
      <footer id="contato" className="bg-slate-900 text-slate-300 py-16">
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
          © 2024 ImobPrime. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}