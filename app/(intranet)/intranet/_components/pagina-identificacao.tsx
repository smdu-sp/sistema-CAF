/** @format */

"use client";

import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Bell, Check, Home, Inbox, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectSeparator, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

type DemoForm = {
  nome: string;
};

const componentes = [
  "avatar",
  "badge",
  "breadcrumb",
  "button",
  "calendar",
  "card",
  "collapsible",
  "dialog",
  "drawer",
  "dropdown-menu",
  "form",
  "input",
  "label",
  "scroll-area",
  "select",
  "separator",
  "sheet",
  "sidebar",
  "skeleton",
  "sonner",
  "table",
  "textarea",
  "tooltip",
];

export function PaginaIdentificacao() {
  const form = useForm<DemoForm>({
    defaultValues: {
      nome: "Intranet",
    },
  });

  return (
    <TooltipProvider>
      <div className="w-full space-y-8 py-4">
        <header className="space-y-3">
          <div>
            <h1 className="text-3xl font-bold leading-tight md:text-4xl">
              Vitrine de UI
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Componentes publicos da pasta components/ui importados em uma
              pagina temporaria para visualizacao.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {componentes.map((componente) => (
              <Badge key={componente} variant="secondary">
                {componente}
              </Badge>
            ))}
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Button, Badge e Tooltip</CardTitle>
              <CardDescription>Variacoes basicas de acao e status.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="link">Link</Button>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="outline">
                      <Bell />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Tooltip do botao com icone</TooltipContent>
                </Tooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>default</Badge>
                <Badge variant="secondary">secondary</Badge>
                <Badge variant="outline">outline</Badge>
                <Badge variant="success">success</Badge>
                <Badge variant="destructive">destructive</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Avatar e Breadcrumb</CardTitle>
              <CardDescription>Identidade visual e trilha de navegacao.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-center gap-3">
                <Avatar className="size-12">
                  <AvatarImage src="/smul_icone_azul.png" alt="SMUL" />
                  <AvatarFallback>SM</AvatarFallback>
                </Avatar>
                <Avatar>
                  <AvatarFallback>IN</AvatarFallback>
                </Avatar>
              </div>

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/intranet">Intranet</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Vitrine</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Input, Label, Textarea e Form</CardTitle>
              <CardDescription>Campos simples e composicao com react-hook-form.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid gap-2">
                <Label htmlFor="email-demo">Label + Input</Label>
                <Input id="email-demo" placeholder="usuario@prefeitura.sp.gov.br" />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="texto-demo">Textarea</Label>
                <Textarea id="texto-demo" placeholder="Escreva um comunicado curto..." />
              </div>

              <Form {...form}>
                <form className="space-y-3">
                  <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FormLabel</FormLabel>
                        <FormControl>
                          <Input placeholder="Nome da pagina" {...field} />
                        </FormControl>
                        <FormDescription>
                          FormDescription aparece abaixo do campo.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </form>
              </Form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Select, Dropdown e Collapsible</CardTitle>
              <CardDescription>Controles de escolha e conteudo expansivel.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Select defaultValue="feed">
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma pagina" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="feed">Feed</SelectItem>
                    <SelectItem value="eventos">Eventos</SelectItem>
                    <SelectSeparator />
                    <SelectItem value="perfil">Perfil</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">Abrir menu</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Menu</DropdownMenuLabel>
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      Perfil
                      <DropdownMenuShortcut>Ctrl P</DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuCheckboxItem checked>
                      Receber avisos
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuRadioGroup value="feed">
                    <DropdownMenuRadioItem value="feed">Feed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="eventos">Eventos</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>Mais opcoes</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <DropdownMenuItem>Comunicados</DropdownMenuItem>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                </DropdownMenuContent>
              </DropdownMenu>

              <Collapsible defaultOpen className="rounded-md border p-3">
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between">
                    Collapsible aberto
                    <Check className="size-4" />
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="pt-3 text-sm text-muted-foreground">
                  Conteudo exibido dentro do componente expansivel.
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dialog, Sheet e Drawer</CardTitle>
              <CardDescription>Camadas interativas para acoes e detalhes.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">Dialog</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>DialogTitle</DialogTitle>
                    <DialogDescription>
                      DialogDescription com informacoes da acao.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button>Fechar</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Sheet</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>SheetTitle</SheetTitle>
                    <SheetDescription>Painel lateral da interface.</SheetDescription>
                  </SheetHeader>
                  <SheetFooter>
                    <Button>Acao</Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>

              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader>
                    <DrawerTitle>DrawerTitle</DrawerTitle>
                    <DrawerDescription>Conteudo exibido pelo rodape.</DrawerDescription>
                  </DrawerHeader>
                  <DrawerFooter>
                    <DrawerClose asChild>
                      <Button>Fechar</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Calendar</CardTitle>
              <CardDescription>Calendario com locale pt-BR.</CardDescription>
            </CardHeader>
            <CardContent>
              <Calendar mode="single" defaultMonth={new Date(2026, 7, 3)} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Table</CardTitle>
              <CardDescription>Linhas, cabecalho e celulas.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pagina</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tipo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Feed</TableCell>
                    <TableCell>Ativo</TableCell>
                    <TableCell>Publicacao</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Eventos</TableCell>
                    <TableCell>Rascunho</TableCell>
                    <TableCell>Agenda</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>ScrollArea, Separator e Skeleton</CardTitle>
              <CardDescription>Area rolavel, divisores e loading.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <ScrollArea className="h-28 rounded-md border p-3">
                <div className="space-y-2 pr-3 text-sm">
                  {Array.from({ length: 8 }, (_, index) => (
                    <p key={index}>Linha rolavel {index + 1}</p>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
              <Separator />
              <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sidebar e Sonner</CardTitle>
              <CardDescription>
                Exemplo estrutural de menu lateral e disparo de toast.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 xl:grid-cols-[320px_1fr]">
              <div className="overflow-hidden rounded-lg border">
                <SidebarProvider className="min-h-[280px]">
                  <Sidebar collapsible="none">
                    <SidebarHeader>
                      <SidebarInput placeholder="Buscar..." />
                    </SidebarHeader>
                    <SidebarSeparator />
                    <SidebarContent>
                      <SidebarGroup>
                        <SidebarGroupLabel>Geral</SidebarGroupLabel>
                        <SidebarGroupAction aria-label="Configurar">
                          <Settings />
                        </SidebarGroupAction>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            <SidebarMenuItem>
                              <SidebarMenuButton isActive>
                                <Home />
                                <span>Inicio</span>
                              </SidebarMenuButton>
                              <SidebarMenuBadge>3</SidebarMenuBadge>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton>
                                <Inbox />
                                <span>Comunicados</span>
                              </SidebarMenuButton>
                              <SidebarMenuAction aria-label="Abrir">
                                <Bell />
                              </SidebarMenuAction>
                            </SidebarMenuItem>
                            <SidebarMenuSub>
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton>Feed</SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                            <SidebarMenuSkeleton showIcon />
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </SidebarGroup>
                    </SidebarContent>
                    <SidebarFooter>
                      <SidebarMenu>
                        <SidebarMenuItem>
                          <SidebarMenuButton>
                            <User />
                            <span>Usuario</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarFooter>
                    <SidebarRail />
                  </Sidebar>
                </SidebarProvider>
              </div>

              <div className="flex flex-col justify-center gap-3 rounded-lg border p-4">
                <p className="text-sm text-muted-foreground">
                  O Toaster tambem esta importado aqui. Clique para testar uma
                  notificacao do Sonner.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button onClick={() => toast.success("Toast de sucesso")}>
                    Sonner success
                  </Button>
                  <SidebarProvider className="min-h-0 w-fit">
                    <SidebarTrigger />
                  </SidebarProvider>
                </div>
                <Toaster richColors />
              </div>
            </CardContent>
            <CardFooter className="text-xs text-muted-foreground">
              Pagina temporaria para referencia visual dos componentes.
            </CardFooter>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
