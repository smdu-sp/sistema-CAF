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
