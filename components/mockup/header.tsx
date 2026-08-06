"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();

  const navItems = [
    { label: "Início", href: "/mockup" },
    { label: "Fale com a gente", href: "/mockup/eventos" },
    { label: "Conteúdos", href: "/mockup/informacoes" },
    { label: "Vídeos", href: "/mockup/videos" },
    { label: "Equipe", href: "/mockup/integrantes" },
    { label: "Parceiros", href: "/mockup/parcerias" },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">
      <header className="max-w-[1180px] mx-auto px-6 py-4 flex items-center justify-between gap-6 flex-wrap">
        <div className="flex flex-col justify-center">
          <h1 className="text-base font-bold flex items-center gap-2">
            <Image src="/mockup/logo-cipa.svg" alt="Logo CIPA SMUL" width={30} height={30} />
            CIPA SMUL
          </h1>
          <p className="text-[0.65rem] self-center">Prevenção de acidentes e assédio</p>
        </div>
        <nav>
          <ul className="flex items-center gap-4 justify-center transition-all duration-300">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href ||
                pathname === `${item.href}/` ||
                (item.href !== "/mockup" && pathname?.startsWith(item.href));

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`text-sm font-bold px-4 py-1.5 rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-[#1f7a3d] text-white shadow-sm"
                        : "text-gray-900 hover:text-green-700"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>
    </div>
  );
}

