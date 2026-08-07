"use client";

import { ArrowRight, TriangleAlert } from "lucide-react";
import { Button } from "@/components/mockup/Button";

interface BannerAlertProps {
  message?: string;
  buttonTitle?: string;
  onButtonClick?: () => void;
}

export function BannerAlert({
  message = "Sofreu ou presenciou assédio moral ou sexual? Você não está sozinho(a).",
  buttonTitle = "Canal de denúncia e Acolhimento",
  onButtonClick = () => alert("funcionou"),
}: BannerAlertProps) {
  return (
    <div className="flex gap-4 items-center justify-center flex-1 bg-[#1f7a3d] py-2">
      <span className="flex justify-center items-center gap-2 text-xs text-white font-bold">
        <TriangleAlert size={14} /> {message}
      </span>
      <Button
        className="text-sm max-w-72 font-bold bg-[#ffffff] text-[#1f7a3d]"
        onClick={onButtonClick}
        title={buttonTitle}
        icon={<ArrowRight size={12} />}
      />
    </div>
  );
}
