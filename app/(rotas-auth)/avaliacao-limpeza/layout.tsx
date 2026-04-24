import { TabsNav } from "@/components/tabs-nav";
import { abasAvaliavaoLimpeza } from "./abas";
import Titulo from "@/components/titulo";

export default function LayoutAvaliacaoLimpeza({ children }: { children: React.ReactNode }) {
    return (
        <div className="w-full h-full flex flex-col">
            <TabsNav abas={abasAvaliavaoLimpeza} />
            <Titulo abas={abasAvaliavaoLimpeza} />
            {children}
        </div>
    );
}
