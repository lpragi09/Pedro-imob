# Configuração do Google Ads - Rastreamento de Conversões

## 📋 Pré-requisitos

1. Ter uma conta do Google Ads ativa
2. Ter criado uma ação de conversão no painel do Google Ads
3. Biblioteca `@next/third-parties` já instalada (já está no projeto)

## 🔧 Passo 1: Obter os IDs do Google Ads

### ID da Conta (NEXT_PUBLIC_GOOGLE_ADS_ID)

1. Acesse o [Google Ads](https://ads.google.com)
2. Vá em **Ferramentas e Configurações** (ícone de chave inglesa no canto superior direito)
3. Clique em **Conversões** no menu lateral
4. Selecione sua ação de conversão
5. Clique na aba **Tag**
6. Procure por **ID da Conta** (formato: `AW-XXXXXXXX`)
   - Exemplo: `AW-123456789`

### ID da Conversão (NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID)

1. Na mesma página da conversão, na aba **Tag**
2. Procure por **ID da Conversão** (formato: `AW-XXXXXXXX/XXXXX`)
   - Exemplo: `AW-123456789/AbC-dEfGhIjKlMnOpQrStUvWxYz`
   - Este é o valor completo que você precisa copiar

## 🔐 Passo 2: Configurar Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `imobiliaria-proto/` com o seguinte conteúdo:

```env
# Google Ads - ID da Conta (formato: AW-XXXXXXXX)
NEXT_PUBLIC_GOOGLE_ADS_ID=AW-XXXXXXXX

# Google Ads - ID da Conversão (formato: AW-XXXXXXXX/XXXXX)
NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_ID=AW-XXXXXXXX/XXXXX
```

**⚠️ IMPORTANTE:**
- Substitua `AW-XXXXXXXX` pelo seu ID da Conta real
- Substitua `AW-XXXXXXXX/XXXXX` pelo seu ID da Conversão real
- O arquivo `.env.local` não deve ser commitado no Git (já está no .gitignore)
- Após criar/editar o `.env.local`, reinicie o servidor de desenvolvimento (`npm run dev`)

## ✅ Passo 3: Verificar a Implementação

O rastreamento já está implementado nos seguintes componentes:

1. **Navbar** - Botão WhatsApp (desktop e mobile)
2. **Página de Detalhes do Imóvel** - Botão "Falar com Corretor"

Todos os botões do WhatsApp agora disparam automaticamente o evento de conversão quando clicados.

## 🧪 Como Testar

1. Configure as variáveis de ambiente no `.env.local`
2. Inicie o servidor: `npm run dev`
3. Abra o DevTools do navegador (F12)
4. Vá na aba **Console**
5. Clique em qualquer botão do WhatsApp
6. Você deve ver a mensagem: `Google Ads: Conversão rastreada com sucesso`
7. No painel do Google Ads, aguarde alguns minutos e verifique se a conversão foi registrada

## 📝 Notas Importantes

- As conversões podem levar alguns minutos para aparecer no painel do Google Ads
- O rastreamento só funciona em produção ou quando você testa com um link de preview do Google Ads
- Certifique-se de que o bloqueador de anúncios não está ativo durante os testes
- O componente `WhatsAppButton` pode ser usado em qualquer lugar do projeto

## 🎯 Exemplo de Uso do Componente

```tsx
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Uso básico
<WhatsAppButton phone="5511999999999" />

// Com mensagem personalizada
<WhatsAppButton 
  phone="5511999999999" 
  message="Olá! Vi o imóvel e quero mais informações."
/>

// Com ID de conversão específico (opcional)
<WhatsAppButton 
  phone="5511999999999"
  conversionId="AW-123456789/AbC-dEfGhIjKlMnOpQrStUvWxYz"
/>

// Variante fixa (flutuante no canto da tela)
<WhatsAppButton 
  phone="5511999999999"
  variant="fixed"
/>
```
