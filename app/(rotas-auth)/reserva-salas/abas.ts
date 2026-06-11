import { IAba } from "@/types/aba";

export const abasReservaSalas: IAba[] = [
  {
    url: "/reserva-salas",
    titulo: "Reservas",
    descricao: "Gerencie suas reservas de salas.",
    permissao: "reserva_salas.reservas.visualizar",
  },
  {
    url: "/reserva-salas/salas",
    titulo: "Salas",
    descricao: "Visualize as salas disponíveis.",
    permissao: "reserva_salas.salas_reserva.visualizar",
  },
  {
    url: "/reserva-salas/agenda",
    titulo: "Agenda",
    descricao: "Visualize a agenda das salas.",
    permissao: "reserva_salas.agenda.visualizar",
  },
];