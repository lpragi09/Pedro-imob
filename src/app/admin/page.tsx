"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Pencil, LogOut, Image as ImageIcon, Loader2, Save, X, Upload } from 'lucide-react';

// Tipagem do Imóvel
type Imovel = {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  cidade: string;
  bairro: string;
  estado: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  tipo: 'VENDA' | 'ALUGUEL';
  imagens: string[];
};

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados do Login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados do CRUD
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoImovel, setEditandoImovel] = useState<Imovel | null>(null);
  const [salvando, setSalvando] = useState(false);

  // Formulário
  const [form, setForm] = useState<Partial<Imovel>>({
    tipo: 'VENDA',
    imagens: []
  });
  const [arquivos, setArquivos] = useState<File[]>([]);

  // 1. Verifica Sessão
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) carregarImoveis();
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) carregarImoveis();
    });

    return () => subscription.unsubscribe();
  }, []);

  const carregarImoveis = async () => {
    const { data } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    if (data) setImoveis(data);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert('Erro ao entrar: ' + error.message);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  // --- UPLOAD DE IMAGENS (ALTA QUALIDADE) ---
  async function uploadImagens(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('imoveis') // Certifique-se que o bucket se chama 'imoveis' no projeto novo
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type 
        });

      if (!error) {
        const { data } = supabase.storage.from('imoveis').getPublicUrl(fileName);
        urls.push(data.publicUrl);
      } else {
        console.error("Erro upload:", error);
      }
    }
    return urls;
  }

  const salvarImovel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      let novasImagens = form.imagens || [];
      
      if (arquivos.length > 0) {
        const urlsUpload = await uploadImagens(arquivos);
        novasImagens = [...novasImagens, ...urlsUpload];
      }

      const dadosFinais = { ...form, imagens: novasImagens, preco: Number(form.preco), quartos: Number(form.quartos), banheiros: Number(form.banheiros), vagas: Number(form.vagas), area: Number(form.area) };

      if (editandoImovel) {
        // Atualizar
        const { error } = await supabase.from('imoveis').update(dadosFinais).eq('id', editandoImovel.id);
        if (error) throw error;
      } else {
        // Criar
        const { error } = await supabase.from('imoveis').insert([dadosFinais]);
        if (error) throw error;
      }

      setModalAberto(false);
      setEditandoImovel(null);
      setForm({ tipo: 'VENDA', imagens: [] });
      setArquivos([]);
      carregarImoveis();

    } catch (error: any) {
      alert('Erro ao salvar: ' + error.message);
    } finally {
      setSalvando(false);
    }
  };

  const deletarImovel = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta propriedade?')) return;
    await supabase.from('imoveis').delete().eq('id', id);
    carregarImoveis();
  };

  const abrirModalEdicao = (imovel: Imovel) => {
    setEditandoImovel(imovel);
    setForm(imovel);
    setArquivos([]);
    setModalAberto(true);
  };

  const abrirModalCriacao = () => {
    setEditandoImovel(null);
    setForm({ tipo: 'VENDA', imagens: [] });
    setArquivos([]);
    setModalAberto(true);
  };

  // --- TELA DE LOGIN (ESTILO TERRAS RURAIS) ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terras-bege p-4">
        <div className="bg-white p-8 rounded-xl border border-terras-marrom/10 shadow-2xl w-full max-w-md">
          <h1 className="text-3xl font-serif text-terras-marrom font-bold mb-2 text-center">Área Restrita</h1>
          <p className="text-terras-marrom/60 text-center mb-8">Acesse para gerenciar suas propriedades</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-terras-marrom uppercase mb-1">E-mail</label>
              <input 
                type="email" 
                value={email} onChange={e => setEmail(e.target.value)} 
                className="w-full bg-terras-bege border border-terras-marrom/20 p-3 rounded text-terras-marrom outline-none focus:border-terras-laranja transition" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-terras-marrom uppercase mb-1">Senha</label>
              <input 
                type="password" 
                value={password} onChange={e => setPassword(e.target.value)} 
                className="w-full bg-terras-bege border border-terras-marrom/20 p-3 rounded text-terras-marrom outline-none focus:border-terras-laranja transition" 
              />
            </div>
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-terras-laranja hover:bg-terras-amarelo text-terras-bege font-bold py-3 rounded uppercase tracking-widest transition shadow-lg shadow-terras-laranja/20"
            >
              {loading ? <Loader2 className="animate-spin mx-auto"/> : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // --- PAINEL PRINCIPAL ---
  return (
    <div className="min-h-screen bg-terras-bege text-terras-marrom font-sans">
      {/* Navbar Admin */}
      <header className="bg-white border-b border-terras-marrom/10 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-serif font-bold text-terras-marrom flex items-center gap-2">
            <span className="text-terras-laranja">Admin</span> Terras Rurais
          </h1>
          <button onClick={handleLogout} className="flex items-center gap-2 text-xs font-bold uppercase hover:text-red-600 transition">
            Sair <LogOut className="w-4 h-4"/>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-serif font-bold">Minhas Propriedades</h2>
            <p className="text-terras-marrom/60 mt-1">{imoveis.length} imóveis cadastrados</p>
          </div>
          <button 
            onClick={abrirModalCriacao} 
            className="bg-terras-laranja hover:bg-terras-amarelo text-terras-bege px-6 py-3 rounded-lg font-bold shadow-lg shadow-terras-laranja/20 flex items-center gap-2 transition hover:-translate-y-1"
          >
            <Plus className="w-5 h-5"/> Novo Imóvel
          </button>
        </div>

        {/* LISTA DE IMÓVEIS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {imoveis.map((imovel) => (
            <div key={imovel.id} className="bg-white border border-terras-marrom/10 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition group">
              <div className="h-48 bg-terras-bege relative">
                 {imovel.imagens && imovel.imagens[0] ? (
                   <img src={imovel.imagens[0]} className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center text-terras-marrom/30"><ImageIcon /></div>
                 )}
                 <div className="absolute top-2 right-2 flex gap-2">
                    <button onClick={() => abrirModalEdicao(imovel)} className="p-2 bg-white/90 text-terras-marrom hover:text-blue-600 rounded-full shadow-md transition"><Pencil className="w-4 h-4"/></button>
                    <button onClick={() => deletarImovel(imovel.id)} className="p-2 bg-white/90 text-terras-marrom hover:text-red-600 rounded-full shadow-md transition"><Trash2 className="w-4 h-4"/></button>
                 </div>
              </div>
              <div className="p-5">
                <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${imovel.tipo === 'VENDA' ? 'bg-terras-marrom/10 text-terras-marrom border-terras-marrom/20' : 'bg-terras-amarelo/20 text-terras-laranja border-terras-amarelo/30'}`}>
                    {imovel.tipo}
                </span>
                <h3 className="font-bold text-lg mt-3 truncate font-serif">{imovel.titulo}</h3>
                <p className="text-sm text-terras-marrom/60 truncate">{imovel.cidade}</p>
                <p className="text-lg font-bold text-terras-laranja mt-2 font-serif">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(imovel.preco)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* MODAL DE CRIAÇÃO/EDIÇÃO */}
      {modalAberto && (
        <div className="fixed inset-0 bg-terras-marrom/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 p-6 md:p-10 relative">
             <button onClick={() => setModalAberto(false)} className="absolute top-6 right-6 text-terras-marrom/40 hover:text-terras-marrom"><X className="w-6 h-6"/></button>
             
             <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
               {editandoImovel ? <Pencil className="w-5 h-5 text-terras-laranja"/> : <Plus className="w-5 h-5 text-terras-laranja"/>}
               {editandoImovel ? 'Editar Propriedade' : 'Cadastrar Nova Propriedade'}
             </h2>

             <form onSubmit={salvarImovel} className="space-y-6">
                
                <div className="grid md:grid-cols-2 gap-6">
                   {/* Coluna 1 */}
                   <div className="space-y-4">
                      <div>
                        <label className="label-admin">Título do Anúncio</label>
                        <input required type="text" value={form.titulo || ''} onChange={e => setForm({...form, titulo: e.target.value})} className="input-admin" placeholder="Ex: Sítio Recanto das Águas" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="label-admin">Preço (R$)</label>
                            <input required type="number" value={form.preco || ''} onChange={e => setForm({...form, preco: Number(e.target.value)})} className="input-admin" placeholder="0,00" />
                         </div>
                         <div>
                            <label className="label-admin">Tipo</label>
                            <select value={form.tipo || 'VENDA'} onChange={e => setForm({...form, tipo: e.target.value as any})} className="input-admin">
                               <option value="VENDA">Venda</option>
                               <option value="ALUGUEL">Arrendamento/Aluguel</option>
                            </select>
                         </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                         <div><label className="label-admin">Cidade</label><input required type="text" value={form.cidade || ''} onChange={e => setForm({...form, cidade: e.target.value})} className="input-admin" /></div>
                         <div><label className="label-admin">Bairro/Região</label><input type="text" value={form.bairro || ''} onChange={e => setForm({...form, bairro: e.target.value})} className="input-admin" /></div>
                         <div><label className="label-admin">Estado</label><input required type="text" value={form.estado || ''} onChange={e => setForm({...form, estado: e.target.value})} className="input-admin" maxLength={2} /></div>
                      </div>
                   </div>

                   {/* Coluna 2 */}
                   <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2">
                         <div><label className="label-admin">Quartos</label><input type="number" value={form.quartos || ''} onChange={e => setForm({...form, quartos: Number(e.target.value)})} className="input-admin text-center" /></div>
                         <div><label className="label-admin">Banheiros</label><input type="number" value={form.banheiros || ''} onChange={e => setForm({...form, banheiros: Number(e.target.value)})} className="input-admin text-center" /></div>
                         <div><label className="label-admin">Vagas</label><input type="number" value={form.vagas || ''} onChange={e => setForm({...form, vagas: Number(e.target.value)})} className="input-admin text-center" /></div>
                         <div><label className="label-admin">Área (m²)</label><input type="number" value={form.area || ''} onChange={e => setForm({...form, area: Number(e.target.value)})} className="input-admin text-center" /></div>
                      </div>
                      
                      <div>
                        <label className="label-admin">Descrição Completa</label>
                        <textarea rows={5} value={form.descricao || ''} onChange={e => setForm({...form, descricao: e.target.value})} className="input-admin resize-none" placeholder="Descreva os detalhes da terra, pasto, casa sede..." />
                      </div>
                   </div>
                </div>

                {/* Área de Imagens */}
                <div className="border-t border-terras-marrom/10 pt-6">
                   <label className="label-admin mb-2 block">Fotos da Propriedade</label>
                   
                   <div className="flex gap-4 mb-4 overflow-x-auto pb-2">
                      {form.imagens?.map((img, i) => (
                        <div key={i} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden group border border-terras-marrom/20">
                           <img src={img} className="w-full h-full object-cover" />
                           <button type="button" onClick={() => setForm({...form, imagens: form.imagens?.filter((_, idx) => idx !== i)})} className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition flex items-center justify-center font-bold text-xs">REMOVER</button>
                        </div>
                      ))}
                   </div>

                   <div className="border-2 border-dashed border-terras-marrom/20 rounded-xl bg-terras-bege p-8 text-center hover:bg-terras-bege/50 hover:border-terras-laranja transition cursor-pointer relative">
                      <input type="file" multiple accept="image/*" onChange={e => { if(e.target.files) setArquivos(Array.from(e.target.files)) }} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center gap-2 text-terras-marrom/60">
                         <Upload className="w-8 h-8 text-terras-laranja" />
                         <span className="text-sm font-bold">Clique para adicionar novas fotos</span>
                         <span className="text-xs">{arquivos.length > 0 ? `${arquivos.length} arquivos selecionados` : 'JPG ou PNG'}</span>
                      </div>
                   </div>
                </div>

                <button 
                  type="submit" 
                  disabled={salvando}
                  className="w-full bg-terras-laranja hover:bg-terras-amarelo text-terras-bege font-bold py-4 rounded-xl uppercase tracking-widest shadow-xl shadow-terras-laranja/20 transition flex items-center justify-center gap-2"
                >
                  {salvando ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5"/> Salvar Propriedade</>}
                </button>

             </form>
          </div>
        </div>
      )}

      {/* Styles globais locais para simplificar o JSX */}
      <style jsx>{`
        .label-admin {
          display: block;
          font-size: 0.75rem; /* text-xs */
          font-weight: 700;
          text-transform: uppercase;
          color: #4a3426; /* terras-marrom */
          margin-bottom: 0.25rem;
          opacity: 0.8;
        }
        .input-admin {
          width: 100%;
          background-color: #f4f1e8; /* terras-bege */
          border: 1px solid rgba(74, 52, 38, 0.2); /* terras-marrom/20 */
          padding: 0.75rem;
          border-radius: 0.5rem;
          color: #4a3426;
          outline: none;
          transition: all;
        }
        .input-admin:focus {
          border-color: #c17a42; /* terras-laranja */
          box-shadow: 0 0 0 1px #c17a42;
        }
      `}</style>
    </div>
  );
}