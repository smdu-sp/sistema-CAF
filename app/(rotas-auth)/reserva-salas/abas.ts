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
  {
    url: "/reserva-salas/minhas",
    titulo: "Minhas Reservas",
    descricao: `
      <p class="text-sm text-muted-foreground mt-1">
        Novas reservas ficam como <strong class="font-medium text-foreground">aguardando aprovação</strong> até
        o administrador confirmar. Somente reservas <strong class="font-medium text-foreground">aprovadas</strong> entram na agenda oficial.
      </p>
    `,
    permissao: "reserva_salas.reservas.visualizar",
  }
];