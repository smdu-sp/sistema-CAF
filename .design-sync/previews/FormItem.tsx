import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  Input,
} from "salas-reuniao-ui";

export function ItemDeFormulario() {
  const methods = useForm({ defaultValues: { nome: "" } });
  return (
    <Form {...methods}>
      <form style={{ width: 320 }}>
        <FormField
          control={methods.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do setor</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Recursos Humanos" {...field} />
              </FormControl>
              <FormDescription>Setor vinculado à assinatura de e-mail.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function VariosItensEmpilhados() {
  const methods = useForm({ defaultValues: { nome: "", sigla: "" } });
  return (
    <Form {...methods}>
      <form style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField
          control={methods.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do setor</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Tecnologia da Informação" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="sigla"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sigla</FormLabel>
              <FormControl>
                <Input placeholder="Ex: TI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
