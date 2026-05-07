import ServiceCards from "@/components/ServiceCard";

export default function Home() {
  return (
    <div className="w-full px-4 md:px-8 relative pb-20 md:pb-14 h-full md:container mx-auto">
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-xl md:text-4xl font-bold">Bem-vindo ao Sistema CAF!</h1>
          <p className="text-sm text-muted-foreground mt-1">Explore nossos serviços e encontre o que você precisa.</p>
        </div>
        <ServiceCards />
      </div>
    </div>
  );
}
