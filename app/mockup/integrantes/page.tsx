import PreviousPage from "@/components/mockup/PreviousPage";
import { ImageIcon } from "lucide-react";
import { mockPeople } from "./mockPeople";

export default function Integrantes() {
  return (
    <main className="max-w-[1180px] mx-auto px-6 py-4">
      <PreviousPage />
      <div className="flex-1 flex-col gap-4 py-4">
        <h1 className="text-3xl font-bold">Integrantes da CIPA 2026/2027</h1>
        <p className="text-xs max-w-[420px]">Conheça a gestão atual, os grupos de trabalho e os ramais de cada coordenadoria.</p>
      </div>
      <section>
        <div>
          <h1 className="py-4 font-bold">Fotos da equipe</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-8 gap-4">
          {mockPeople.map(({ id, name, role }) => {
            return (
              <div key={id} className="flex flex-col items-center gap-2">
                <div className="w-25 h-40 flex flex-col text-center items-center justify-center rounded-lg gap-2 bg-[#f5f5f7] border border-dashed border-gray-300 p-4">
                  <ImageIcon className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500 font-normal">Miniatura do vídeo</span>
                </div>
                <div className="flex flex-col text-center gap-1 p-2 rounded-lg">
                  <p className="font-bold text-[11px] text-gray-900">{name}</p>
                  <p className="text-[10px] text-gray-500 italic">{role}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
