/** @format */

import {
  CalendarDays,
  ContactRound,
  Home,
  Megaphone,
  Newspaper,
  UserRound,
  type LucideIcon,
} from "lucide-react";

export interface IntranetNavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

export const intranetNavigationItems: IntranetNavigationItem[] = [
  {
    label: "Inicio",
    href: "/intranet/feed",
    icon: Home,
    exact: true,
  },
  {
    label: "Aniversarios",
    href: "/intranet/aniversarios",
    icon: CalendarDays,
  },
  {
    label: "Comunicados",
    href: "/intranet/comunicados",
    icon: Megaphone,
  },
  {
    label: "Diretorio",
    href: "/intranet/diretorio",
    icon: ContactRound,
  },
  {
    label: "Eventos",
    href: "/intranet/eventos",
    icon: Newspaper,
  },
  {
    label: "Meu perfil",
    href: "/intranet/perfil",
    icon: UserRound,
  },
];
