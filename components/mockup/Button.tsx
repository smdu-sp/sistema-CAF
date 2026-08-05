"use client";

interface ButtonProps {
  title: string;
  onClick: (e: React.MouseEvent) => void;
  icon?: React.ReactNode;
}

export const Button = ({ title, onClick, icon }: ButtonProps) => {
  return (
    <button onClick={onClick} className="bg-[#1f7a32] max-w-52 rounded-full text-white px-4 py-2 hover:bg-green-500 cursor-pointer flex justify-center items-center text-center gap-2 text-sm">
      {title} {icon}
    </button>
  );
};
