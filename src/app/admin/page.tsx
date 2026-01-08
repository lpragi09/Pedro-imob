"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Save, Trash2, Pencil, Loader2, X, Upload, Image as ImageIcon, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';

type Imovel = {
  id: number;
  titulo: string;
  descricao: string;
  preco: number;
  tipo: string;
  quartos: number;
  banheiros: number;
  vagas: number;
  area: number;
  cidade: string;
  bairro: string;
  imagens: string[];
};

export default function AdminPanel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imoveis, setImoveis] = useState<Imovel[]>([]);
  const [imovelEmEdicao, setImovelEmEdicao] = useState<Imovel | null>(null);
  const [arquivosSelecionados, setArquivosSelecionados] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);

  useEffect(() => { carregarImoveis(); }, []);

  async function carregarImoveis() {
    const { data } = await supabase.from('imoveis').select('*').order('created_at', { ascending: false });
    if (data) setImoveis(data);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const novosArquivos = Array.from(e.target.files);
      setArquivosSelecionados((prev) => [...prev, ...novosArquivos]);
      const novasUrls = novosArquivos.map(file => URL.createObjectURL(file));
      setPreviewUrls((prev) => [...prev, ...novasUrls]);
    }
  };

  const removerImagemDoPreview = (index: number) => {
    setArquivosSelecionados(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  async function uploadImagens(files: File[]): Promise<string[]> {
    const urls: string[] = [];
    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error } = await supabase.storage.from('imoveis').upload(fileName, file);
      if (!error) {
        const { data } = supabase.storage.from('imoveis').getPublicUrl(fileName);
        urls.push(data.publicUrl);
      }
    }
    return urls;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData(event.currentTarget);
      let urlsFinais = imovelEmEdicao?.imagens || [];
      if (arquivosSelecionados.length > 0) {
        const novasUrls = await uploadImagens(arquivosSelecionados);
        urlsFinais = [...urlsFinais, ...novasUrls];
      }
      if (urlsFinais.length === 0) { alert("Adicione pelo menos uma foto."); setLoading(false); return; }

      const dados = {
        titulo: formData.get('titulo'),
        descricao: formData.get('descricao'),
        preco: Number(formData.get('preco')),
        tipo: formData.get('tipo'),
        quartos: Number(formData.get('quartos')),
        banheiros: Number(formData.get('banheiros')),
        vagas: Number(formData.get('vagas')),
        area: Number(formData.get('area')),
        cidade: formData.get('cidade'),
        bairro: formData.get('bairro'),
        imagens: urlsFinais,
        destaque: true,
      };

      if (imovelEmEdicao) {
        await supabase.from('imoveis').update(dados).eq('id', imovelEmEdicao.id);
        alert("Atualizado com sucesso!");
      } else {
        await supabase.from('imoveis').insert([dados]);
        alert("Cadastrado com sucesso!");
      }
      setImovelEmEdicao(null); setArquivosSelecionados([]); setPreviewUrls([]);
      (event.target as HTMLFormElement).reset();
      await carregarImoveis(); router.refresh();
    } catch (error) { console.error(error); alert("Erro ao salvar."); } finally { setLoading(false); }
  }

  async function deletarImovel(id: number) {
    if (confirm("Tem certeza que deseja remover este imóvel do catálogo?")) {
      await supabase.from('imoveis').delete().eq('id', id);
      await carregarImoveis(); router.refresh();
    }
  }

  function preencherFormulario(imovel: Imovel) {
    setImovelEmEdicao(imovel); setArquivosSelecionados([]); setPreviewUrls([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Estilos Comuns para Inputs Dark
  const inputClass = "w-full p-4 bg-slate-950 border border-slate-800 rounded-sm outline-none text-slate-200 focus:border-yellow-600 focus:ring-1 focus:ring-yellow-600/50 transition font-light placeholder:text-slate-600";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2";

  return (
    <div className="min-h-screen bg-black text-slate-200 py-12 px-4 font-sans selection:bg-yellow-900 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* HEADER */}
        <div className="flex items-center gap-4 border-b border-white/10 pb-8">
           <div className="bg-yellow-600/10 p-3 rounded-full"><Shield className="text-yellow-600 w-8 h-8"/></div>
           <div>
              <h1 className="text-3xl font-serif text-white">Painel Administrativo</h1>
              <p className="text-slate-500 font-light">Gerencie o acervo exclusivo da ImobPrime</p>
           </div>
        </div>
        
        <div className="grid lg:grid-cols-12 gap-8">
            {/* FORMULÁRIO (Lado Esquerdo/Topo) */}
            <div className="lg:col-span-7 space-y-8">
                <div className="bg-slate-900 p-8 rounded-sm border border-white/5 shadow-2xl">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-serif text-white">{imovelEmEdicao ? 'Editar Propriedade' : 'Nova Propriedade'}</h2>
                        {imovelEmEdicao && <button onClick={() => { setImovelEmEdicao(null); setPreviewUrls([]); }} className="text-xs text-red-500 hover:text-red-400 uppercase tracking-widest font-bold flex gap-2"><X className="w-4 h-4"/> Cancelar</button>}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div><label className={labelClass}>Título do Anúncio</label><input name="titulo" defaultValue={imovelEmEdicao?.titulo} required className={inputClass} placeholder="Ex: Penthouse no Jardins" /></div>
                        <div><label className={labelClass}>Descrição Completa</label><textarea name="descricao" defaultValue={imovelEmEdicao?.descricao} required rows={4} className={inputClass} placeholder="Detalhes que encantam..." /></div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>Cidade</label><input name="cidade" defaultValue={imovelEmEdicao?.cidade} required className={inputClass} /></div>
                            <div><label className={labelClass}>Bairro</label><input name="bairro" defaultValue={imovelEmEdicao?.bairro} required className={inputClass} /></div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div><label className={labelClass}>Preço (R$)</label><input name="preco" defaultValue={imovelEmEdicao?.preco} required type="number" className={inputClass} /></div>
                            <div><label className={labelClass}>Tipo</label><select name="tipo" defaultValue={imovelEmEdicao?.tipo} className={inputClass}><option value="VENDA">Venda</option><option value="ALUGUEL">Aluguel</option></select></div>
                        </div>

                        <div className="grid grid-cols-4 gap-2">
                            <div><label className={labelClass}>Quartos</label><input name="quartos" defaultValue={imovelEmEdicao?.quartos} required type="number" className={inputClass} /></div>
                            <div><label className={labelClass}>Banheiros</label><input name="banheiros" defaultValue={imovelEmEdicao?.banheiros} required type="number" className={inputClass} /></div>
                            <div><label className={labelClass}>Vagas</label><input name="vagas" defaultValue={imovelEmEdicao?.vagas} required type="number" className={inputClass} /></div>
                            <div><label className={labelClass}>Área (m²)</label><input name="area" defaultValue={imovelEmEdicao?.area} required type="number" className={inputClass} /></div>
                        </div>

                        <div>
                            <label className={labelClass}>Fotos</label>
                            <div className="border border-dashed border-slate-700 bg-slate-950/50 rounded-sm p-8 flex flex-col items-center justify-center cursor-pointer hover:border-yellow-600/50 hover:bg-slate-950 transition relative group">
                                <input type="file" multiple accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                                <Upload className="w-8 h-8 text-slate-600 group-hover:text-yellow-600 transition mb-2" />
                                <span className="text-xs text-slate-500 uppercase tracking-widest font-bold">Adicionar Imagens</span>
                            </div>
                            
                            {/* Previews */}
                            <div className="grid grid-cols-4 gap-2 mt-4">
                                {imovelEmEdicao?.imagens?.map((img, idx) => (<div key={`old-${idx}`} className="h-16 rounded-sm overflow-hidden border border-slate-700 opacity-50"><img src={img} className="w-full h-full object-cover" /></div>))}
                                {previewUrls.map((url, idx) => (<div key={`new-${idx}`} className="relative h-16 rounded-sm overflow-hidden border border-yellow-600"><img src={url} className="w-full h-full object-cover" /><button type="button" onClick={() => removerImagemDoPreview(idx)} className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 hover:opacity-100 transition"><X className="text-white w-4 h-4"/></button></div>))}
                            </div>
                        </div>

                        <button disabled={loading} type="submit" className="w-full bg-white hover:bg-slate-200 text-black font-bold uppercase tracking-widest py-4 rounded-sm transition flex items-center justify-center gap-2">
                            {loading ? <Loader2 className="animate-spin" /> : <Save className="w-4 h-4" />} {imovelEmEdicao ? 'Salvar Alterações' : 'Publicar Imóvel'}
                        </button>
                    </form>
                </div>
            </div>

            {/* LISTA (Lado Direito/Baixo) */}
            <div className="lg:col-span-5">
                <div className="bg-slate-900 p-8 rounded-sm border border-white/5 shadow-2xl h-full">
                    <h2 className="text-xl font-serif text-white mb-6">Acervo Atual</h2>
                    <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                        {imoveis.map((imovel) => (
                        <div key={imovel.id} className="group p-4 bg-slate-950 border border-slate-800 hover:border-yellow-600/30 transition rounded-sm flex gap-4">
                            <img src={imovel.imagens ? imovel.imagens[0] : ''} className="w-20 h-20 object-cover bg-slate-900 grayscale group-hover:grayscale-0 transition duration-500" />
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-white truncate font-serif">{imovel.titulo}</h3>
                                <p className="text-xs text-slate-500 uppercase tracking-wider mt-1">{imovel.cidade}</p>
                                <p className="text-yellow-600 font-serif mt-2 text-sm">{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(imovel.preco)}</p>
                            </div>
                            <div className="flex flex-col gap-2">
                                <button onClick={() => preencherFormulario(imovel)} className="p-2 bg-slate-900 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-600 rounded-sm transition"><Pencil className="w-3 h-3"/></button>
                                <button onClick={() => deletarImovel(imovel.id)} className="p-2 bg-slate-900 text-red-900 hover:text-red-500 border border-slate-800 hover:border-red-900/30 rounded-sm transition"><Trash2 className="w-3 h-3"/></button>
                            </div>
                        </div>
                        ))}
                        {imoveis.length === 0 && <p className="text-slate-600 text-center py-10 italic">Nenhum imóvel cadastrado.</p>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}