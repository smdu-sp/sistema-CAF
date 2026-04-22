import ServiceCards from "@/components/ServiceCard";

export default function Home() {
  return (
    <div>
      <h1 className="text-xl md:text-4xl font-bold">Bem-vindo ao Sistema CAF!</h1>
      <p className="text-sm text-muted-foreground mt-1">Explore nossos serviços e encontre o que você precisa.</p>
      <ServiceCards />
    </div>
  )
  // TODO: Realocar navbar para ficar acima de botao de criar reserva
  // TODO: ajustar navbar para ficar no meio
  // TODO: Realocar botão de criar reserva para ficar acima de tabela, mas abaixo do navbar
  // TODO: Ajustar padding da pagina inicial e do reservas de salas

}
