"use client";

import { useEffect } from "react";
import { useFormState, useFormStatus } from "react-dom";
import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Mail,
  MessageSquareText,
  Phone,
  Send,
  User,
} from "lucide-react";
import { sendEmail, type ContactActionState } from "@/app/actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center justify-center gap-2 rounded-xl bg-terras-laranja text-terras-bege px-6 py-4 font-bold uppercase tracking-widest text-xs shadow-lg shadow-terras-laranja/20 transition hover:bg-terras-amarelo disabled:opacity-60"
    >
      {pending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
      {pending ? "Enviando..." : "Enviar"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useFormState<ContactActionState, FormData>(sendEmail, {
    ok: false,
    message: "",
  });

  // Quando der sucesso, a UX fica melhor limpando os campos
  useEffect(() => {
    if (!state.ok) return;
    const form = document.getElementById("contact-form") as HTMLFormElement | null;
    form?.reset();
  }, [state.ok]);

  return (
    <div className="w-full max-w-5xl mx-auto grid gap-6 lg:gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
      <div className="w-full rounded-2xl border border-terras-bege/10 bg-terras-bege/5 backdrop-blur-sm shadow-2xl shadow-black/25 p-5 sm:p-8">
        <div className="mb-6">
          <h3 className="text-2xl sm:text-3xl font-serif text-terras-bege">
            Vamos encontrar a sua terra ideal
          </h3>
          <p className="text-terras-bege/70 mt-2 text-sm leading-relaxed">
            Conte o que você busca (sítio, fazenda, investimento) e a região. A gente te responde com
            opções e ajustes pra fechar com segurança.
          </p>
        </div>

        <form id="contact-form" action={formAction} className="space-y-4">
          {/* Honeypot anti-spam */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-terras-bege/70">
                Nome
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terras-bege/50" />
                <input
                  name="nome"
                  required
                  placeholder="Seu nome"
                  className="w-full rounded-xl bg-terras-marrom/30 border border-terras-bege/10 px-12 py-3 text-terras-bege placeholder:text-terras-bege/40 outline-none focus:border-terras-laranja/70 focus:ring-1 focus:ring-terras-laranja/40"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-bold uppercase tracking-widest text-terras-bege/70">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terras-bege/50" />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="voce@exemplo.com"
                  className="w-full rounded-xl bg-terras-marrom/30 border border-terras-bege/10 px-12 py-3 text-terras-bege placeholder:text-terras-bege/40 outline-none focus:border-terras-laranja/70 focus:ring-1 focus:ring-terras-laranja/40"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-terras-bege/70">
              WhatsApp (opcional)
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-terras-bege/50" />
              <input
                name="whatsapp"
                inputMode="tel"
                placeholder="(35) 99999-9999"
                className="w-full rounded-xl bg-terras-marrom/30 border border-terras-bege/10 px-12 py-3 text-terras-bege placeholder:text-terras-bege/40 outline-none focus:border-terras-laranja/70 focus:ring-1 focus:ring-terras-laranja/40"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase tracking-widest text-terras-bege/70">
              Mensagem
            </label>
            <div className="relative">
              <MessageSquareText className="absolute left-4 top-4 w-4 h-4 text-terras-bege/50" />
              <textarea
                name="mensagem"
                required
                rows={5}
                placeholder="Ex.: Quero um sítio até X km de..., orçamento..., preferência por água/estrada..."
                className="w-full rounded-xl bg-terras-marrom/30 border border-terras-bege/10 px-12 py-3 text-terras-bege placeholder:text-terras-bege/40 outline-none focus:border-terras-laranja/70 focus:ring-1 focus:ring-terras-laranja/40 resize-none"
              />
            </div>
          </div>

          {state.message ? (
            <div
              className={`rounded-xl border px-4 py-3 text-sm flex items-start gap-2 ${
                state.ok
                  ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
                  : "border-red-400/30 bg-red-500/10 text-red-100"
              }`}
              role="status"
              aria-live="polite"
            >
              {state.ok ? (
                <CheckCircle2 className="w-5 h-5 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 mt-0.5" />
              )}
              <span>{state.message}</span>
            </div>
          ) : null}

          <div className="pt-2">
            <SubmitButton />
          </div>
        </form>
      </div>

      <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
        <div className="rounded-2xl border border-terras-bege/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl shadow-black/20">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-terras-bege/10 p-3">
              <Mail className="w-5 h-5 text-terras-laranja" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-terras-bege/70">
                E-mail
              </p>
              <p className="text-terras-bege mt-1 break-all">
                contato@terrasruraisimoveis.com.br
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-terras-bege/10 bg-white/5 backdrop-blur-sm p-6 shadow-xl shadow-black/20">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-terras-bege/10 p-3">
              <Phone className="w-5 h-5 text-terras-laranja" />
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-widest text-terras-bege/70">
                WhatsApp
              </p>
              <p className="text-terras-bege mt-1">(35) 9922-7700</p>
            </div>
          </div>
        </div>

        <div className="sm:col-span-2 lg:col-span-1 rounded-2xl border border-terras-bege/10 bg-terras-bege/5 p-6 shadow-xl shadow-black/20">
          <p className="font-serif text-xl text-terras-bege leading-snug">
            “Terra boa é a que você consegue viver e prosperar.”
          </p>
          <p className="text-terras-bege/70 mt-3 text-sm leading-relaxed">
            A gente te ajuda a acertar a região, o tamanho e os detalhes que fazem diferença na hora
            de comprar.
          </p>
        </div>
      </div>
    </div>
  );
}

