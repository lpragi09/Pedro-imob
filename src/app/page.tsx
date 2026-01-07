import { Search, Home, MapPin, Key, User, Menu } from 'lucide-react';
import { supabase } from '@/lib/supabase'; // Importando seu cliente

// Função para formatar dinheiro (R$)
const formatarPreco = (valor: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(valor);
}

export default async function HomeImobiliaria() {
  
  // BUSCANDO DADOS DO SUPABASE (Ao vivo!)
  const { data: imoveis, error } = await supabase
    .from('imoveis')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Erro ao buscar imóveis:", error);
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
  
      {/* HERO SECTION */}
      <div className="relative bg-slate-900 py-20 px-4">
        <div className="absolute inset-0 overflow-hidden">
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

      {/* DESTAQUES DINÂMICOS */}
      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Imóveis Recentes</h2>
            <p className="text-slate-500">As melhores oportunidades direto do banco de dados</p>
          </div>
          <a href="#" className="text-blue-600 font-bold text-sm hover:underline">Ver todos &rarr;</a>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Se não tiver imóveis, mostra aviso */}
          {(!imoveis || imoveis.length === 0) && (
            <p className="text-slate-500 col-span-3 text-center py-10">Nenhum imóvel encontrado no sistema...</p>
          )}

          {/* Mapeando os imóveis do Banco */}
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
                  <span className="text-sm text-slate-500 font-medium">{imovel.descricao}</span>
                  <span className="text-blue-600 font-black text-xl">
                    {formatarPreco(imovel.preco)}
                    {imovel.tipo === 'ALUGUEL' && <span className="text-xs text-slate-400 font-normal">/mês</span>}
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
    </div>
  );
}