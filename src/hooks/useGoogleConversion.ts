"use client";

import { useCallback } from "react";

/**
 * Hook para disparar eventos de conversão do Google Ads
 * 
 * @param sendTo - ID da conversão no formato "AW-XXXXXXXX/XXXXX"
 * @returns Função para disparar a conversão (nunca lança erros, apenas loga warnings)
 * 
 * Exemplo de uso:
 * const trackConversion = useGoogleConversion("AW-123456789/AbC-dEfGhIjKlMnOpQrStUvWxYz");
 * trackConversion();
 */
export function useGoogleConversion(sendTo?: string) {
  const trackConversion = useCallback(() => {
    try {
      // Verifica se está no cliente (evita erros de hidratação)
      if (typeof window === "undefined") {
        return;
      }

      // Usa o sendTo do parâmetro ou tenta pegar da variável de ambiente
      const conversionId = sendTo || process.env.NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID;

      if (!conversionId) {
        // Não loga em produção para evitar poluir o console
        if (process.env.NODE_ENV === "development") {
          console.warn("Google Ads: ID de conversão não encontrado. Configure NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID no .env.local");
        }
        return;
      }

      // Verifica se gtag existe (pode estar bloqueado por AdBlockers)
      // Usa optional chaining para evitar erros se o script não carregou
      const gtag = (window as any).gtag;
      
      if (typeof gtag === "function") {
        // Método preferido: usa gtag diretamente (formato oficial do Google Ads)
        gtag("event", "conversion", {
          send_to: conversionId,
        });
        
        if (process.env.NODE_ENV === "development") {
          console.log("Google Ads: Conversão rastreada com sucesso via gtag", { send_to: conversionId });
        }
        return;
      }

      // Fallback: tenta usar dataLayer (caso gtag não esteja disponível)
      // Usa optional chaining para segurança
      const dataLayer = window.dataLayer;
      
      if (dataLayer && Array.isArray(dataLayer) && typeof dataLayer.push === "function") {
        dataLayer.push({
          event: "conversion",
          send_to: conversionId,
        });
        
        if (process.env.NODE_ENV === "development") {
          console.log("Google Ads: Conversão rastreada com sucesso via dataLayer", { send_to: conversionId });
        }
        return;
      }

      // Se nenhum método funcionou, apenas silencia (não quebra o fluxo)
      // Isso pode acontecer se o usuário tiver bloqueadores de anúncios
      if (process.env.NODE_ENV === "development") {
        console.warn("Google Ads: gtag e dataLayer não disponíveis. Rastreamento de conversão não executado (pode ser bloqueador de anúncios).");
      }
    } catch (error) {
      // Captura qualquer erro inesperado e não propaga (garante que o WhatsApp sempre funcione)
      // Em produção, não loga para evitar poluir o console do usuário
      if (process.env.NODE_ENV === "development") {
        console.error("Google Ads: Erro ao rastrear conversão (não crítico):", error);
      }
    }
  }, [sendTo]);

  return trackConversion;
}

// Declaração de tipo global para o dataLayer e gtag
declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  }
}
