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
  Textarea,
} from "salas-reuniao-ui";

export function ControleComInput() {
  const methods = useForm({ defaultValues: { numero: "" } });
  return (
    <Form {...methods}>
      <form style={{ width: 320 }}>
        <FormField
          control={methods.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número do ramal</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 4521" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function ControleComTextarea() {
  const methods = useForm({ defaultValues: { observacoes: "" } });
  return (
    <Form {...methods}>
      <form style={{ width: 320 }}>
        <FormField
          control={methods.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações do chamado</FormLabel>
              <FormControl>
                <Textarea placeholder="Descreva o problema encontrado..." {...field} />
              </FormControl>
              <FormDescription>Detalhe o ocorrido para agilizar o atendimento.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
