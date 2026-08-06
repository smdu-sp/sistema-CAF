/** @format */

export type IntranetEntityId = string | number;

export interface IntranetBirthday {
  id: IntranetEntityId;
  name: string;
  dept: string;
  day: number;
  imageUrl?: string | null;
  congratulated?: boolean;
  congratulators?: string[];
}

export interface IntranetBirthdayConfig {
  today: number;
  monthLabel: string;
}

export interface IntranetAnnouncement {
  id: IntranetEntityId;
  date: string;
  title: string;
  text: string;
}

export interface IntranetDepartment {
  id: IntranetEntityId;
  sigla: string;
  name: string;
  head: string;
  email: string;
  phone: string;
}

export interface IntranetEvent {
  id: IntranetEntityId;
  day: string;
  monthShort: string;
  title: string;
  desc: string;
}

export interface IntranetProfile {
  id: IntranetEntityId;
  name: string;
  role: string;
  email: string;
  extension: string;
  room: string;
  imageUrl?: string | null;
}

export type IntranetPublicationType =
  | "comum"
  | "comunicado"
  | "conquista"
  | "kudos"
  | "vaga";

export interface IntranetPostComment {
  id: IntranetEntityId;
  author: string;
  text: string;
  initials?: string;
  avatarColor?: string;
}

export interface IntranetPost {
  id: IntranetEntityId;
  author: string;
  cargo: string;
  time: string;
  type: IntranetPublicationType;
  text: string;
  image?: string | { src: string; height: number; width: number } | null;
  likes: number;
  likedByMe?: boolean;
  comments?: IntranetPostComment[];
}
