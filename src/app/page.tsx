import { Search, Home, MapPin, Key, DollarSign, Menu, User } from 'lucide-react';

export default function HomeImobiliaria() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* HEADER / NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Home className="text-white w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-blue-900 tracking-tight">Imob<span className="text-blue-600">Prime</span></span>
          </div>

          <div className="hidden md:flex gap-8 font-medium text-slate-600 text-sm">
            <a href="#" className="hover:text-blue-600 transition">Comprar</a>
            <a href="#" className="hover:text-blue-600 transition">Alugar</a>
            <a href="#" className="hover:text-blue-600 transition">Lançamentos</a>
            <a href="#" className="hover:text-blue-600 transition">Sobre</a>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 text-slate-600 hover:text-blue-600 font-medium text-sm">
              <User className="w-4 h-4" /> Entrar
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-bold text-sm transition shadow-lg shadow-blue-900/10">
              Anunciar Imóvel
            </button>
            <button className="md:hidden p-2 text-slate-600">
              <Menu />
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <div className="relative bg-slate-900 py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
           {/* Imagem de fundo com overlay */}
           <div className="absolute inset-0 bg-gradient-to-r from-slate-900 to-slate-900/80 z-10"></div>
           <img src="https://images.unsplash.com/photo-1600596542815-e32870110274?auto=format&fit=crop&q=80" className="w-full h-full object-cover opacity-50" alt="Casa moderna" />
        </div>

        <div className="relative z-20 max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Encontre o lugar que você <br/>sempre sonhou.
          </h1>
          <p className="text-slate-300 text-lg md:text-xl max-w-2xl mx-auto">
            Milhares de casas, apartamentos e terrenos para compra e aluguel com a segurança que você precisa.
          </p>

          {/* BARRA DE BUSCA */}
          <div className="bg-white p-2 rounded-2xl shadow-2xl shadow-black/20 max-w-3xl mx-auto flex flex-col md:flex-row gap-2 mt-8">
            <div className="flex-1 flex items-center px-4 bg-slate-100 rounded-xl">
              <MapPin className="text-slate-400 w-5 h-5 mr-3" />
              <input type="text" placeholder="Cidade, Bairro ou Rua" className="bg-transparent w-full py-4 outline-none text-slate-700 font-medium placeholder:text-slate-400" />
            </div>
            <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition">
              <Search className="w-5 h-5" /> Buscar
            </button>
          </div>
        </div>
      </div>

      {/* DESTAQUES */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Imóveis em Destaque</h2>
            <p className="text-slate-500">As melhores oportunidades selecionadas para você</p>
          </div>
          <a href="#" className="text-blue-600 font-bold text-sm hover:underline">Ver todos &rarr;</a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* CARD 1 */}
          <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer">
            <div className="h-64 overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">VENDA</span>
              <img src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            </div>
            <div className="p-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">Casa em Condomínio</span>
                <span className="text-blue-600 font-black text-xl">R$ 1.250.000</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1">Mansão Moderna Alphaville</h3>
              <div className="flex gap-4 text-slate-500 text-sm border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1"><Key className="w-4 h-4"/> 4 Quartos</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> 320m²</span>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer">
            <div className="h-64 overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">ALUGUEL</span>
              <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            </div>
            <div className="p-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">Apartamento</span>
                <span className="text-blue-600 font-black text-xl">R$ 4.500 <span className="text-xs text-slate-400 font-normal">/mês</span></span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1">Flat de Luxo Jardins</h3>
              <div className="flex gap-4 text-slate-500 text-sm border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1"><Key className="w-4 h-4"/> 2 Quartos</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> 85m²</span>
              </div>
            </div>
          </div>

           {/* CARD 3 */}
           <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:border-blue-200 transition-all duration-300 cursor-pointer">
            <div className="h-64 overflow-hidden relative">
              <span className="absolute top-4 left-4 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">VENDA</span>
              <img src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80" className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
            </div>
            <div className="p-6">
              <div className="flex items-baseline justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">Sobrado</span>
                <span className="text-blue-600 font-black text-xl">R$ 890.000</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-4 line-clamp-1">Casa Familiar Centro</h3>
              <div className="flex gap-4 text-slate-500 text-sm border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1"><Key className="w-4 h-4"/> 3 Quartos</span>
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4"/> 180m²</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}