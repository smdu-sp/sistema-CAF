import Link from "next/link";
import Image from "next/image";

export function Header() {
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
          <ul className="flex items-center gap-8 justify-center">
            <li className="hover:text-blue-600">
              <Link href="/mockup">Início</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/mockup">Fale com a gente</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/mockup">Conteúdos</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/mockup">Equipe</Link>
            </li>
            <li className="hover:text-blue-600">
              <Link href="/mockup">Parceiros</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
