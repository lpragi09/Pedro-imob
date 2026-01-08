import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/admin/:path*"], // Protege tudo que estiver dentro de /admin
};

export function middleware(req: NextRequest) {
  // Pega o cabeçalho de autenticação basica
  const basicAuth = req.headers.get("authorization");
  const url = req.nextUrl;

  if (basicAuth) {
    // Decodifica o usuário e senha que o navegador mandou
    const authValue = basicAuth.split(" ")[1];
    const [user, pwd] = atob(authValue).split(":");

    // Verifica se bate com o que está no .env
    if (user === process.env.ADMIN_USER && pwd === process.env.ADMIN_PASSWORD) {
      return NextResponse.next();
    }
  }

  // Se não tiver autenticado ou errou a senha, retorna erro 401 (que abre o popup do navegador)
  url.pathname = "/api/auth";
  return new NextResponse("Acesso Negado", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Área Restrita Administrativa"',
    },
  });
}