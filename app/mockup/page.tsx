"use client";

import { useState, useRef } from "react";
import { Header } from "@/components/mockup/header";
import { Boxes } from "@/app/mockup/mockBoxes";
import { Button } from "@/components/mockup/Button";
import { ArrowRight, FileWarning, Image as ImageIcon } from "lucide-react";
import { AccessibilityBar } from "@/components/mockup/accessibility-bar";

export default function home() {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };
  return (
    <div>
      <AccessibilityBar />
      <Header />
      <div className="flex gap-4 items-center justify-center flex-1 bg-green-600 py-2">
        <span className=" flex justify-center items-center gap-4 text-xs text-white font-bold">
          <FileWarning size={14} /> Sofreu ou presenciou assédio moral ou sexual? Você não está sozinho(a).
        </span>
        <Button className="text-sm flex-1 max-w-72" onClick={() => alert("funcionou")} title={"Canal de denúncia e Acolhimento "} icon={<ArrowRight size={12} />} />
      </div>
      <main className="max-w-[1180px] mx-auto px-6 py-4">
        <div className="w-full flex flex-col gap-4 bg-gray-100 rounded-lg py-8 mb-8 px-6">
          <section className="flex flex-col gap-4 ">
            <p className="text-[#1f7a32] text-xs uppercase font-bold tracking-widest">Comissão Interna de Prevenção de Acidentes e Assédio</p>
            <p className="text-4xl font-bold">CIPA SMUL — Gestão 2026–2028</p>
            <p className="text-base text-gray-500 mb-8">Aqui na SMUL tem CIPA. Conheça quem somos, o que fazemos e como falar com a gente.</p>
          </section>
          <section className="flex justify-center gap-4">
            {Boxes.map(({ title, description, list, id }) => {
              return (
                <div key={id} className="flex-1 flex flex-col gap-2 max-w-80 bg-gray-200 p-4 rounded-lg">
                  <p className="font-bold text-lg">{title}</p>
                  {description ? <p className="text-sm">{description}</p> : null}
                  {list ? (
                    <ul className=" flex flex-col list-disc">
                      {list?.map((item, key) => {
                        return (
                          <li className=" ml-4 text-sm" key={key}>
                            {item}
                          </li>
                        );
                      })}
                    </ul>
                  ) : null}
                </div>
              );
            })}
          </section>
        </div>
        <div className="flex justify-center items-center gap-16 bg-gray-100 rounded-lg p-8">
          <section
            onClick={() => fileInputRef.current?.click()}
            className="relative flex flex-col items-center justify-center w-72 h-44 p-3 bg-gray-200 rounded-2xl cursor-pointer group hover:bg-gray-300 transition-colors shrink-0"
          >
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
            {preview ? (
              <img src={preview} alt="Cartaz do mês" className="w-full h-full object-cover rounded-xl" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 border border-dashed border-gray-400/80 rounded-xl p-4 group-hover:border-gray-500 transition-colors">
                <ImageIcon className="w-8 h-8 text-gray-500" />
                <p className="text-sm text-gray-500 font-normal text-center">Arraste aqui o cartaz do mês</p>
              </div>
            )}
          </section>
          <section className="flex flex-1 flex-col gap-4">
            <p className="font-bold text-lg">Nosso cartaz do mês</p>
            <p className="text-sm text-gray-500 max-w-[500px]">
              Atualizado periodicamente pela CIPA. Arraste uma nova imagem no quadro ao lado para substituir o cartaz atual — os cartazes anteriores ficam guardados na área de Conteúdos.
            </p>
            <Button className="max-w-52" onClick={() => alert("Funcionou ")} title={"Ver Cartazes anteriores"} icon={<ArrowRight size={14} />} />
          </section>
        </div>
      </main>
    </div>
  );
}
