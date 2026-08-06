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
          <ul className="flex items-center gap-8 justify-center transition-all duration-300">
            <li className="hover:text-gray-700 ease-in-out">
              <Link href="/mockup/">Início</Link>
            </li>
            <li className="hover:text-gray-700 ease-in-out">
              <Link href="/mockup/eventos">Fale com a gente</Link>
            </li>
            <li className="hover:text-gray-700 ease-in-out">
              <Link href="/mockup/informacoes">Conteúdos</Link>
            </li>
            <li className="hover:text-gray-700 ease-in-out">
              <Link href="/mockup/videos">Vídeos</Link>
            </li>
            <li className="hover:text-gray-700 ease-in-out">
              <Link href="/mockup/integrantes">Equipe</Link>
            </li>
            <li className="hover:text-gray-700 ease-in-out">
              <Link href="/mockup/parcerias">Parceiros</Link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
}
