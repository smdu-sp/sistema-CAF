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
  Button,
} from "salas-reuniao-ui";

export function FormCargo() {
  const methods = useForm({ defaultValues: { nome: "" } });
  return (
    <Form {...methods}>
      <form style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField
          control={methods.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do cargo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Analista de Sistemas" {...field} />
              </FormControl>
              <FormDescription>Nome exibido na assinatura de e-mail.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Cadastrar</Button>
      </form>
    </Form>
  );
}

export function FormSalaReuniao() {
  const methods = useForm({
    defaultValues: { nome: "", andar: "", numero: "" },
  });
  return (
    <Form {...methods}>
      <form style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField
          control={methods.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome da sala</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sala de reunião" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="andar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Andar (opcional)</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 2º andar" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Salvar</Button>
      </form>
    </Form>
  );
}
