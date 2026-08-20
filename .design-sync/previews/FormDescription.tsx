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

export function DescricaoDeAjuda() {
  const methods = useForm({ defaultValues: { nome: "" } });
  return (
    <Form {...methods}>
      <form style={{ width: 320 }}>
        <FormField
          control={methods.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do cargo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Analista de Sistemas" {...field} />
              </FormControl>
              <FormDescription>Nome exibido no sistema de assinatura de e-mail.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function DescricaoLonga() {
  const methods = useForm({ defaultValues: { lotacao: "" } });
  return (
    <Form {...methods}>
      <form style={{ width: 320 }}>
        <FormField
          control={methods.control}
          name="lotacao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lotação máxima</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Ex: 12" {...field} />
              </FormControl>
              <FormDescription>
                Quantidade máxima de pessoas permitida simultaneamente nesta sala de reunião.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
