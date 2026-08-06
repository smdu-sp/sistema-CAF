/** @format */

"use client";

import {
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { pessoasMock as peopleMock } from "../../aniversarios/data/people";
import { numberToMonth } from "../../aniversarios/data/conversorMonths";
import Link from "next/link";

interface IntranetSideBirthProps {
    supportHref?: string;
}

function parseDateBirthday(date: string) {
    const [year, month, day] = date.split("-").map(Number);
    return { year, month, day };
}

function getInitials(name: string): string {
    return name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();
}

export function IntranetSideBirthday({
    supportHref = "/intranet/aniversarios",
}: IntranetSideBirthProps) {
    const todaysBirthdays = peopleMock.filter((person) => {
        const { month, day } = parseDateBirthday(person.data_nascimento);
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        return month === currentMonth && day === currentDay;
    });

    return (
        <div>
            <SidebarContent>
                <SidebarGroup>
                    <div className="flex justify-between">
                        <SidebarGroupLabel>Aniversários</SidebarGroupLabel>
                        <SidebarGroupLabel>
                            <Link
                                href={supportHref}
                                className="text-primary transition-colors duration-200 hover:underline"
                            >
                                Ver todos
                            </Link>
                        </SidebarGroupLabel>
                    </div>
                    <SidebarGroupContent>
                        {todaysBirthdays.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                Nenhum aniversário hoje.
                            </p>
                        ) : (
                            <ul>
                                {todaysBirthdays.map((person, index) => {
                                    const initials = getInitials(person.nome);
                                    const { month, day } = parseDateBirthday(person.data_nascimento);
                                    return (
                                        <li key={index} className="flex items-center gap-3 py-2">
                                            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                                                {initials}
                                            </span>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">
                                                    {person.nome}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {day} {numberToMonth[month]}
                                                </p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </div>
    );
}