"use client";

import { MessageCircle } from "lucide-react";
import { useGoogleConversion } from "@/hooks/useGoogleConversion";

interface WhatsAppButtonProps {
  /**
   * Número do WhatsApp no formato internacional (ex: 5511999999999)
   * Sem espaços, parênteses ou hífens
   */
  phone: string;
  
  /**
   * Texto pré-preenchido para o WhatsApp (opcional)
   */
  message?: string;
  
  /**
   * ID da conversão do Google Ads (opcional)
   * Se não fornecido, usa NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID do .env.local
   */
  conversionId?: string;
  
  /**
   * Variante do botão: "default" | "fixed" | "large"
   */
  variant?: "default" | "fixed" | "large";
  
  /**
   * Classes CSS adicionais
   */
  className?: string;
  
  /**
   * Texto do botão
   */
  children?: React.ReactNode;
}

/**
 * Componente de botão do WhatsApp com rastreamento de conversão do Google Ads
 * 
 * Dispara automaticamente um evento de conversão quando o usuário clica no botão.
 */
export function WhatsAppButton({
  phone,
  message = "",
  conversionId,
  variant = "default",
  className = "",
  children,
}: WhatsAppButtonProps) {
  const trackConversion = useGoogleConversion(conversionId);

  // Formata o link do WhatsApp
  const textoFormatado = message ? encodeURIComponent(message) : "";
  const linkWhatsApp = `https://wa.me/${phone}${textoFormatado ? `?text=${textoFormatado}` : ""}`;

  // Estilos baseados na variante
  const variantStyles = {
    default: "bg-[#25D366] hover:bg-[#20bd5a] text-white px-5 py-2 rounded font-bold text-xs uppercase tracking-widest shadow-lg transition flex items-center gap-2",
    fixed: "fixed bottom-6 right-6 z-50 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-4 rounded-full font-bold text-sm uppercase tracking-widest shadow-2xl transition-all duration-300 hover:scale-110 flex items-center gap-2",
    large: "bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-5 rounded-full font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-3 transition-all duration-300 shadow-xl shadow-green-900/10 hover:-translate-y-1",
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Dispara a conversão antes de abrir o WhatsApp
    // Usa try/catch para garantir que o WhatsApp sempre funcione, mesmo se o rastreamento falhar
    try {
      trackConversion();
    } catch (error) {
      // Silencia erros - o WhatsApp deve funcionar sempre, independente do rastreamento
      // A função trackConversion já trata erros internamente, mas garantimos aqui também
      if (process.env.NODE_ENV === "development") {
        console.warn("WhatsAppButton: Erro ao rastrear conversão (não crítico):", error);
      }
    }
    // O link do WhatsApp continua funcionando normalmente mesmo se o rastreamento falhar
  };

  return (
    <a
      href={linkWhatsApp}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${variantStyles[variant]} ${className}`}
    >
      <MessageCircle className={variant === "large" ? "w-5 h-5" : "w-4 h-4"} />
      {children || "WhatsApp"}
    </a>
  );
}
