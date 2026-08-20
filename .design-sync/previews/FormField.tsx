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

export function CamposControlados() {
  const methods = useForm({
    defaultValues: { nome: "", numero: "" },
  });
  return (
    <Form {...methods}>
      <form style={{ width: 320, display: "flex", flexDirection: "column", gap: 16 }}>
        <FormField
          control={methods.control}
          name="nome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome do ramal</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Suporte TI" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={methods.control}
          name="numero"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input placeholder="Ex: 4521" {...field} />
              </FormControl>
              <FormDescription>Ramal interno de 4 dígitos.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
