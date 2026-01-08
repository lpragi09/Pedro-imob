import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: "/admin/:path*",
};

export function middleware(req: NextRequest) {
  // CONFIGURAÇÃO DIRETA (Para funcionar no Deploy sem .env)
  // Depois você pode mudar para variáveis de ambiente se quiser
  const ADMIN_USER = "admin";
  const ADMIN_PASS = "queijominas";

  const basicAuth = req.headers.get("authorization");

  if (basicAuth) {
    try {
      // Separa o "Basic " do código
      const authValue = basicAuth.split(" ")[1];
      
      // Decodifica usuário:senha
      const [user, pwd] = atob(authValue).split(":");

      // Verifica se bate com a senha definida acima
      if (user === ADMIN_USER && pwd === ADMIN_PASS) {
        return NextResponse.next();
      }
    } catch (e) {
      // Se der erro na decodificação, apenas pede senha de novo
      console.error("Erro no auth:", e);
    }
  }

  // Se não tiver logado, pede a senha
  return new NextResponse("Área Restrita", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Admin ImobPrime"',
    },
  });
}