import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram } from "lucide-react";

const linksNavegacao = [
  { label: "Início", href: "/#topo" },
  { label: "Propriedades", href: "/#imoveis" },
  // Leva direto para a página com filtros (acervo)
  { label: "Acervo", href: "/imoveis#imoveis" },
  { label: "Quem Somos", href: "/#sobre" },
  { label: "Contato", href: "/#contato" },
];

export function Footer() {
  return (
    <footer
      id="rodape"
      className="bg-[#3a281d] text-terras-bege py-20 border-t border-terras-bege/10"
    >
      <div className="max-w-7xl mx-auto px-6 grid gap-12 text-sm font-light md:grid-cols-2 lg:grid-cols-4 items-start">
        <div className="space-y-4 md:-mt-10">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Terras Rurais - Página inicial"
            className="inline-flex items-start"
          >
            <Image
              src="/logo-terrasrurais.png"
              alt="Logo Terras Rurais"
              width={260}
              height={80}
              className="h-28 w-auto sm:h-32 md:h-40"
              sizes="(max-width: 640px) 440px, (max-width: 1024px) 560px, 680px"
            />
          </Link>
          <p className="text-terras-bege/70 max-w-sm">
            Seu parceiro de confiança para compra e venda de imóveis rurais.
            Conectando você ao melhor do campo.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="uppercase tracking-widest text-xs font-bold text-terras-amarelo">
            Navegação
          </h4>
          <nav aria-label="Navegação do rodapé">
            <ul className="space-y-3 text-base">
              {linksNavegacao.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-terras-bege/90 hover:text-terras-laranja transition"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="space-y-4">
          <h4 className="uppercase tracking-widest text-xs font-bold text-terras-amarelo">
            Contatos
          </h4>
          <a
            href="https://wa.me/553599227700"
            target="_blank"
            rel="noopener noreferrer"
            className="text-terras-bege/90 hover:text-terras-laranja transition block"
          >
            (35) 9922-7700
          </a>
          <a
            href="mailto:contato@terrasrurais.com.br"
            className="text-terras-bege/90 hover:text-terras-laranja transition block"
          >
            contato@terrasrurais.com.br
          </a>
        </div>

        <div className="space-y-4">
          <h4 className="uppercase tracking-widest text-xs font-bold text-terras-amarelo">
            Redes Sociais
          </h4>
          <div className="flex flex-col gap-3 text-terras-bege/90">
            <a
              href="https://www.instagram.com/terrasrurais_/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terras-laranja transition inline-flex items-center gap-2"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" /> Instagram
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61586922623813"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-terras-laranja transition inline-flex items-center gap-2"
              aria-label="Facebook"
            >
              <Facebook className="w-5 h-5" /> Facebook
            </a>
          </div>
        </div>
      </div>

      <div className="text-center mt-20 text-xs text-terras-bege/50 uppercase tracking-widest pt-8 border-t border-terras-bege/5">
        © 2026 Terras Rurais. Todos os direitos reservados.
      </div>
    </footer>
  );
}

