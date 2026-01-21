"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { Trash2, Plus, Pencil, LogOut, Image as ImageIcon, Loader2, Save, X, Upload, User, ChevronUp, ChevronDown } from 'lucide-react';

// Tipagem do Imóvel
type Imovel = {
  id: string;
  titulo: string;
  descricao: string;
  preco: number;
  cidade: string;
  bairro: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  tipo: 'VENDA' | 'ALUGUEL';
  imagens: string[];
  videos?: string[];
};

type FotoItem = {
  id: string;
  kind: 'existing' | 'new';
  previewUrl: string;
  url?: string;
  file?: File;
};

type VideoItem = {
  id: string;
  kind: 'existing' | 'new';
  previewUrl: string;
  url?: string;
  file?: File;
};

const gerarId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

function moverItem<T>(arr: T[], from: number, to: number) {
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

function limparObjectUrls(items: Array<{ kind: 'existing' | 'new'; previewUrl: string }>) {
  for (const item of items) {
    if (item.kind === 'new' && item.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(item.previewUrl);
    }
  }
}

function publicUrlToStoragePath(url: string, bucket: string) {
  const marker = `/storage/v1/object/public/${bucket}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  const path = url.slice(idx + marker.length);
  return decodeURIComponent(path);
}

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Estados do Login
  const [usuario, setUsuario] = useState(''); 
  const [password, setPassword] = useState('');

  // Estados do CRUD
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [modalAberto, setModalAberto] = useState(false);
  const [editandoImovel, setEditandoImovel] = useState<Imovel | null>(null);
  const [salvando, setSalvando] = useState(false);
  const [confirmacaoExclusao, setConfirmacaoExclusao] = useState<{
    id: string;
    titulo?: string;
  } | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  // Formulário
  const [form, setForm] = useState<Partial<Imovel>>({
    tipo: 'VENDA',
    imagens: [],
    videos: [],
    quartos: 0,
    banheiros: 0,
    vagas: 0,
    area: 0,
  });
  const [fotos, setFotos] = useState<FotoItem[]>([]);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [avisoMidia, setAvisoMidia] = useState<string | null>(null);

  // Limites práticos (o Supabase Storage pode impor limites dependendo do plano/configuração)
  const MAX_VIDEO_BYTES = 50 * 1024 * 1024; // 50MB
  const MAX_IMAGE_BYTES = 10 * 1024 * 1024; // 10MB

  const formatBytes = (bytes: number) => {
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(0)}MB`;
  };

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

    let emailFinal = usuario.trim();
    if (emailFinal === 'admin') {
        emailFinal = 'admin@terras.com';
    }

    const { error } = await supabase.auth.signInWithPassword({ 
        email: emailFinal, 
        password 
    });

    if (error) alert('Erro ao entrar: Verifique a senha ou usuário.');
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const fecharModal = () => {
    limparObjectUrls(fotos);
    limparObjectUrls(videos);
    setModalAberto(false);
    setEditandoImovel(null);
    setForm({ tipo: 'VENDA', imagens: [], videos: [], quartos: 0, banheiros: 0, vagas: 0, area: 0 });
    setFotos([]);
    setVideos([]);
    setAvisoMidia(null);
  };

  // --- NOVA FUNÇÃO DE MANIPULAÇÃO DE ARQUIVOS ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvisoMidia(null);
      const novosArquivos = Array.from(e.target.files);

      const validos = novosArquivos.filter((f) => {
        if (f.size <= MAX_IMAGE_BYTES) return true;
        setAvisoMidia(
          `Uma ou mais imagens foram ignoradas porque excedem ${formatBytes(MAX_IMAGE_BYTES)}. ` +
            `Dica: reduza o tamanho antes de enviar.`
        );
        return false;
      });

      const novasFotos: FotoItem[] = validos.map((file) => ({
        id: gerarId(),
        kind: 'new',
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setFotos((prev) => [...prev, ...novasFotos]);
      e.target.value = '';
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setAvisoMidia(null);
      const novosArquivos = Array.from(e.target.files);

      // iPhone frequentemente exporta vídeos como .mov (video/quicktime), então aceitamos formatos comuns.
      const suportado = (f: File) => {
        const type = (f.type || '').toLowerCase();
        const ext = (f.name.split('.').pop() || '').toLowerCase();
        if (type.startsWith('video/')) return true;
        if (['mp4', 'mov', 'm4v'].includes(ext)) return true;
        return false;
      };

      const apenasVideos = novosArquivos.filter(suportado);
      if (apenasVideos.length !== novosArquivos.length) {
        setAvisoMidia(
          'Alguns arquivos foram ignorados porque não parecem ser vídeos. ' +
            'Dica: selecione um vídeo MP4/MOV diretamente da galeria.'
        );
      }

      const validos = apenasVideos.filter((f) => {
        if (f.size <= MAX_VIDEO_BYTES) return true;
        setAvisoMidia(
          `Um ou mais vídeos foram ignorados porque excedem ${formatBytes(MAX_VIDEO_BYTES)}. ` +
            `Recomendação: exportar/compactar para até ${formatBytes(MAX_VIDEO_BYTES)} e tentar novamente.`
        );
        return false;
      });

      const novosVideos: VideoItem[] = validos.map((file) => ({
        id: gerarId(),
        kind: 'new',
        file,
        previewUrl: URL.createObjectURL(file),
      }));

      setVideos((prev) => [...prev, ...novosVideos]);
      e.target.value = '';
    }
  };

  // --- UPLOAD DE IMAGENS ---
  async function uploadImagem(file: File): Promise<string> {
    if (file.size > MAX_IMAGE_BYTES) {
      throw new Error(`Imagem muito grande. Limite recomendado: ${formatBytes(MAX_IMAGE_BYTES)}.`);
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('imoveis')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage.from('imoveis').getPublicUrl(fileName);
    return data.publicUrl;
  }

  // --- UPLOAD DE VÍDEOS (MP4) ---
  async function uploadVideo(file: File): Promise<string> {
    if (file.size > MAX_VIDEO_BYTES) {
      throw new Error(`Vídeo muito grande. Limite recomendado: ${formatBytes(MAX_VIDEO_BYTES)}.`);
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `videos/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

    const { error } = await supabase.storage
      .from('imoveis')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      });

    if (error) throw error;

    const { data } = supabase.storage.from('imoveis').getPublicUrl(fileName);
    return data.publicUrl;
  }

  const removerFoto = (id: string) => {
    setFotos((prev) => {
      const alvo = prev.find((f) => f.id === id);
      if (alvo?.kind === 'new' && alvo.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(alvo.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const removerVideo = (id: string) => {
    setVideos((prev) => {
      const alvo = prev.find((v) => v.id === id);
      if (alvo?.kind === 'new' && alvo.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(alvo.previewUrl);
      }
      return prev.filter((v) => v.id !== id);
    });
  };

  const moverFotoPorIndice = (fromIndex: number, toIndex: number) => {
    setFotos((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      return moverItem(prev, fromIndex, toIndex);
    });
  };

  const moverVideoPorIndice = (fromIndex: number, toIndex: number) => {
    setVideos((prev) => {
      if (toIndex < 0 || toIndex >= prev.length) return prev;
      return moverItem(prev, fromIndex, toIndex);
    });
  };

  const salvarImovel = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);
    setAvisoMidia(null);

    try {
      const toNumber = (value: unknown, fallback = 0) => {
        const n = Number(value);
        return Number.isFinite(n) ? n : fallback;
      };

      const imagensOrdenadas: string[] = [];
      for (const foto of fotos) {
        if (foto.kind === 'existing' && foto.url) {
          imagensOrdenadas.push(foto.url);
          continue;
        }
        if (foto.kind === 'new' && foto.file) {
          const url = await uploadImagem(foto.file);
          imagensOrdenadas.push(url);
          continue;
        }
      }

      const videosOrdenados: string[] = [];
      for (const video of videos) {
        if (video.kind === 'existing' && video.url) {
          videosOrdenados.push(video.url);
          continue;
        }
        if (video.kind === 'new' && video.file) {
          const url = await uploadVideo(video.file);
          videosOrdenados.push(url);
          continue;
        }
      }

      const dadosFinais = { 
        ...form, 
        imagens: imagensOrdenadas,
        videos: videosOrdenados,
        preco: toNumber(form.preco),
        quartos: toNumber(form.quartos),
        banheiros: toNumber(form.banheiros),
        vagas: toNumber(form.vagas),
        area: toNumber(form.area),
      };

      if (editandoImovel) {
        const { error } = await supabase.from('imoveis').update(dadosFinais).eq('id', editandoImovel.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('imoveis').insert([dadosFinais]);
        if (error) throw error;
      }

      setModalAberto(false);
      setEditandoImovel(null);
      setForm({ tipo: 'VENDA', imagens: [], videos: [], quartos: 0, banheiros: 0, vagas: 0, area: 0 });
      setFotos([]);
      setVideos([]);
      carregarImoveis();

    } catch (error: any) {
      const msg = String(error?.message || '');
      if (msg.toLowerCase().includes('maximum allowed size') || msg.toLowerCase().includes('exceeded')) {
        setAvisoMidia(
          `O Supabase recusou o upload porque o arquivo excede o tamanho máximo permitido. ` +
            `Tente enviar um MP4 menor (ex.: até ${formatBytes(MAX_VIDEO_BYTES)}).`
        );
      } else {
        setAvisoMidia(`Erro ao salvar: ${msg || 'tente novamente.'}`);
      }
    } finally {
      setSalvando(false);
    }
  };

  const deletarImovel = async (id: string) => {
    setExcluindo(true);
    try {
      // Tenta limpar arquivos do Storage (best effort). Pode falhar por política/permissão e não deve impedir a exclusão do registro.
      const { data: midia } = await supabase
        .from('imoveis')
        .select('imagens, videos')
        .eq('id', id)
        .single();

      const imagens: string[] = (midia as any)?.imagens || [];
      const vids: string[] = (midia as any)?.videos || [];

      const paths = [...imagens, ...vids]
        .map((url) => publicUrlToStoragePath(url, 'imoveis'))
        .filter((p): p is string => Boolean(p));

      if (paths.length > 0) {
        await supabase.storage.from('imoveis').remove(paths);
      }

      const { error } = await supabase.from('imoveis').delete().eq('id', id);
      if (error) throw error;
      await carregarImoveis();
    } catch (error: any) {
      alert('Erro ao excluir: ' + (error?.message || 'tente novamente.'));
    } finally {
      setExcluindo(false);
      setConfirmacaoExclusao(null);
    }
  };

  const abrirModalEdicao = (imovel: Imovel) => {
    limparObjectUrls(fotos);
    limparObjectUrls(videos);
    setAvisoMidia(null);
    setEditandoImovel(imovel);
    setForm(imovel);
    setFotos((imovel.imagens || []).map((url) => ({
      id: gerarId(),
      kind: 'existing',
      url,
      previewUrl: url,
    })));
    setVideos((imovel.videos || []).map((url) => ({
      id: gerarId(),
      kind: 'existing',
      url,
      previewUrl: url,
    })));
    setModalAberto(true);
  };

  const abrirModalCriacao = () => {
    limparObjectUrls(fotos);
    limparObjectUrls(videos);
    setAvisoMidia(null);
    setEditandoImovel(null);
    setForm({ tipo: 'VENDA', imagens: [], videos: [], quartos: 0, banheiros: 0, vagas: 0, area: 0 });
    setFotos([]);
    setVideos([]);
    setModalAberto(true);
  };

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-terras-bege p-4">
        <div className="bg-white p-8 rounded-xl border border-terras-marrom/10 shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="bg-terras-marrom/10 p-4 rounded-full">
                <User className="w-8 h-8 text-terras-laranja" />
            </div>
          </div>
          <h1 className="text-3xl font-serif text-terras-marrom font-bold mb-2 text-center">Área Restrita</h1>
          <p className="text-terras-marrom/60 text-center mb-8">Digite seu usuário de administrador</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-terras-marrom uppercase mb-1">Usuário</label>
              <input 
                type="text" 
                value={usuario} onChange={e => setUsuario(e.target.value)} 
                placeholder="Ex: admin"
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

  return (
    <div className="min-h-screen bg-terras-bege text-terras-marrom font-sans">
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
                    <button
                      onClick={() => setConfirmacaoExclusao({ id: imovel.id, titulo: imovel.titulo })}
                      className="p-2 bg-white/90 text-terras-marrom hover:text-red-600 rounded-full shadow-md transition"
                    >
                      <Trash2 className="w-4 h-4"/>
                    </button>
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

      {/* Modal de confirmação de exclusão (não depende do confirm() do navegador) */}
      {confirmacaoExclusao && (
        <div
          className="fixed inset-0 bg-terras-marrom/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar exclusão"
          onClick={() => (excluindo ? null : setConfirmacaoExclusao(null))}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 md:p-8 relative animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setConfirmacaoExclusao(null)}
              disabled={excluindo}
              className="absolute top-6 right-6 text-terras-marrom/40 hover:text-terras-marrom disabled:opacity-50"
              aria-label="Fechar"
            >
              <X className="w-6 h-6"/>
            </button>

            <h3 className="text-xl md:text-2xl font-serif font-bold text-terras-marrom mb-2">
              Confirmar exclusão
            </h3>
            <p className="text-terras-marrom/70 mb-6">
              Tem certeza que deseja excluir este imóvel? Essa ação não pode ser desfeita.
            </p>

            {confirmacaoExclusao.titulo && (
              <div className="bg-terras-bege border border-terras-marrom/10 rounded-xl p-4 mb-6">
                <p className="text-xs font-bold uppercase tracking-widest text-terras-marrom/60 mb-1">Imóvel</p>
                <p className="font-serif font-bold text-terras-marrom">{confirmacaoExclusao.titulo}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-end">
              <button
                type="button"
                onClick={() => setConfirmacaoExclusao(null)}
                disabled={excluindo}
                className="px-5 py-3 rounded-xl border border-terras-marrom/20 text-terras-marrom font-bold hover:bg-terras-bege transition disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => deletarImovel(confirmacaoExclusao.id)}
                disabled={excluindo}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {excluindo ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}

      {modalAberto && (
        <div className="fixed inset-0 bg-terras-marrom/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-2xl animate-in zoom-in-95 p-6 md:p-10 relative">
             <button onClick={fecharModal} className="absolute top-6 right-6 text-terras-marrom/40 hover:text-terras-marrom"><X className="w-6 h-6"/></button>
             
             <h2 className="text-2xl font-serif font-bold mb-8 flex items-center gap-2">
               {editandoImovel ? <Pencil className="w-5 h-5 text-terras-laranja"/> : <Plus className="w-5 h-5 text-terras-laranja"/>}
               {editandoImovel ? 'Editar Propriedade' : 'Cadastrar Nova Propriedade'}
             </h2>

             <form onSubmit={salvarImovel} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                   <div className="space-y-4">
                      <div><label className="label-admin">Título</label><input required type="text" value={form.titulo || ''} onChange={e => setForm({...form, titulo: e.target.value})} className="input-admin" /></div>
                      <div className="grid grid-cols-2 gap-4">
                         <div><label className="label-admin">Preço</label><input required type="number" value={form.preco || ''} onChange={e => setForm({...form, preco: Number(e.target.value)})} className="input-admin" /></div>
                         <div><label className="label-admin">Tipo</label><select value={form.tipo || 'VENDA'} onChange={e => setForm({...form, tipo: e.target.value as any})} className="input-admin"><option value="VENDA">Venda</option><option value="ALUGUEL">Aluguel</option></select></div>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                         <div><label className="label-admin">Cidade</label><input required type="text" value={form.cidade || ''} onChange={e => setForm({...form, cidade: e.target.value})} className="input-admin" /></div>
                         <div><label className="label-admin">Bairro</label><input type="text" value={form.bairro || ''} onChange={e => setForm({...form, bairro: e.target.value})} className="input-admin" /></div>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <div className="grid grid-cols-4 gap-2">
                         <div><label className="label-admin">Qua</label><input min={0} step={1} type="number" value={form.quartos ?? ''} onChange={e => setForm({...form, quartos: e.target.value === '' ? undefined : Number(e.target.value)})} className="input-admin text-center" /></div>
                         <div><label className="label-admin">Ban</label><input min={0} step={1} type="number" value={form.banheiros ?? ''} onChange={e => setForm({...form, banheiros: e.target.value === '' ? undefined : Number(e.target.value)})} className="input-admin text-center" /></div>
                         <div><label className="label-admin">Vag</label><input min={0} step={1} type="number" value={form.vagas ?? ''} onChange={e => setForm({...form, vagas: e.target.value === '' ? undefined : Number(e.target.value)})} className="input-admin text-center" /></div>
                         <div><label className="label-admin">m²</label><input min={0} step={1} type="number" value={form.area ?? ''} onChange={e => setForm({...form, area: e.target.value === '' ? undefined : Number(e.target.value)})} className="input-admin text-center" /></div>
                      </div>
                      <div><label className="label-admin">Descrição</label><textarea rows={5} value={form.descricao || ''} onChange={e => setForm({...form, descricao: e.target.value})} className="input-admin resize-none" /></div>
                   </div>
                </div>

                <div className="border-t border-terras-marrom/10 pt-6">
                   <label className="label-admin mb-2 block">Fotos</label>
                   {fotos.length > 0 ? (
                    <div className="mb-4">
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                        {fotos.map((foto, index) => (
                          <div
                            key={foto.id}
                            className="relative rounded-lg overflow-hidden border border-terras-marrom/20 bg-white group"
                          >
                            <img src={foto.previewUrl} className="w-full h-24 object-cover" />

                            <div className="absolute top-2 left-2 flex items-center gap-1">
                              <span className="text-[10px] font-bold bg-terras-marrom/80 text-terras-bege px-2 py-1 rounded-full">
                                {index + 1}
                              </span>
                            </div>

                            <div className="absolute top-2 right-2 flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => moverFotoPorIndice(index, index - 1)}
                                className="p-1.5 rounded-full bg-white/90 text-terras-marrom hover:text-terras-laranja shadow-sm disabled:opacity-40"
                                aria-label="Mover foto para cima"
                                disabled={index === 0}
                              >
                                <ChevronUp className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moverFotoPorIndice(index, index + 1)}
                                className="p-1.5 rounded-full bg-white/90 text-terras-marrom hover:text-terras-laranja shadow-sm disabled:opacity-40"
                                aria-label="Mover foto para baixo"
                                disabled={index === fotos.length - 1}
                              >
                                <ChevronDown className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => removerFoto(foto.id)}
                                className="p-1.5 rounded-full bg-white/90 text-terras-marrom hover:text-red-600 shadow-sm"
                                aria-label="Remover foto"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                   ) : null}
                   <div className="border-2 border-dashed border-terras-marrom/20 rounded-xl bg-terras-bege p-8 text-center hover:bg-terras-bege/50 hover:border-terras-laranja transition cursor-pointer relative">
                      <input type="file" multiple accept="image/*" onChange={handleFileChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      <div className="flex flex-col items-center gap-2 text-terras-marrom/60">
                         <Upload className="w-8 h-8 text-terras-laranja" /><span className="text-sm font-bold">Adicionar fotos</span>
                      </div>
                   </div>
                </div>

                <div className="border-t border-terras-marrom/10 pt-6">
                  <label className="label-admin mb-2 block">Vídeos (MP4)</label>
                  <p className="text-[11px] text-terras-marrom/60 mb-4">
                    Recomendado: até 30–60s por vídeo e arquivo leve para tocar rápido no celular.
                  </p>

                  {avisoMidia ? (
                    <div className="mb-4 rounded-xl border border-terras-laranja/30 bg-terras-laranja/10 p-4 text-sm text-terras-marrom">
                      {avisoMidia}
                    </div>
                  ) : null}

                  {videos.length > 0 ? (
                    <div className="mb-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {videos.map((video, index) => (
                          <div
                            key={video.id}
                            className="relative rounded-xl overflow-hidden border border-terras-marrom/20 bg-white"
                          >
                            <div className="p-3 flex items-center justify-between gap-3 border-b border-terras-marrom/10">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-terras-marrom/80 text-terras-bege px-2 py-1 rounded-full">
                                  {index + 1}
                                </span>
                              </div>

                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => moverVideoPorIndice(index, index - 1)}
                                  className="p-1.5 rounded-full bg-terras-bege text-terras-marrom hover:text-terras-laranja border border-terras-marrom/10 disabled:opacity-40"
                                  aria-label="Mover vídeo para cima"
                                  disabled={index === 0}
                                >
                                  <ChevronUp className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => moverVideoPorIndice(index, index + 1)}
                                  className="p-1.5 rounded-full bg-terras-bege text-terras-marrom hover:text-terras-laranja border border-terras-marrom/10 disabled:opacity-40"
                                  aria-label="Mover vídeo para baixo"
                                  disabled={index === videos.length - 1}
                                >
                                  <ChevronDown className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removerVideo(video.id)}
                                  className="p-1.5 rounded-full bg-terras-bege text-terras-marrom hover:text-red-600 border border-terras-marrom/10"
                                  aria-label="Remover vídeo"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            <div className="p-3">
                              <video
                                src={video.previewUrl}
                                className="w-full h-48 bg-black rounded-lg"
                                controls
                                preload="metadata"
                                playsInline
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  <div className="border-2 border-dashed border-terras-marrom/20 rounded-xl bg-terras-bege p-8 text-center hover:bg-terras-bege/50 hover:border-terras-laranja transition cursor-pointer relative">
                    <input
                      type="file"
                      multiple
                      accept="video/*,.mp4,.mov,.m4v"
                      onChange={handleVideoChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center gap-2 text-terras-marrom/60">
                      <Upload className="w-8 h-8 text-terras-laranja" />
                      <span className="text-sm font-bold">Adicionar vídeos</span>
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={salvando} className="w-full bg-terras-laranja hover:bg-terras-amarelo text-terras-bege font-bold py-4 rounded-xl uppercase tracking-widest shadow-xl shadow-terras-laranja/20 transition flex items-center justify-center gap-2">
                  {salvando ? <Loader2 className="animate-spin" /> : <><Save className="w-5 h-5"/> Salvar</>}
                </button>
             </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .label-admin { display: block; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #4a3426; margin-bottom: 0.25rem; opacity: 0.8; }
        .input-admin { width: 100%; background-color: #f4f1e8; border: 1px solid rgba(74, 52, 38, 0.2); padding: 0.75rem; border-radius: 0.5rem; color: #4a3426; outline: none; transition: all; }
        .input-admin:focus { border-color: #c17a42; box-shadow: 0 0 0 1px #c17a42; }
      `}</style>
    </div>
  );
}