import { IAba } from "@/types/aba";

export const abasReservaSalas: IAba[] = [
  {
    url: "/reserva-salas",
    titulo: "Reservas",
    descricao: "Gerencie suas reservas de salas.",
    permissoes: ["USR", "DEV", "ADM"],
  },
  {
    url: "/reserva-salas/salas",
    titulo: "Salas",
    descricao: "Visualize as salas disponíveis.",
    permissoes: ["DEV", "ADM"],
  },
  {
    url: "/reserva-salas/agenda",
    titulo: "Agenda",
    descricao: "Visualize a agenda das salas.",
    permissoes: ["DEV", "ADM"],
  },
];