import * as React from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
} from "salas-reuniao-ui";

export function SemErro() {
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
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export function ComErroDeValidacao() {
  const methods = useForm({ defaultValues: { nome: "" } });
  React.useEffect(() => {
    methods.setError("nome", { message: "Nome é obrigatório" });
  }, [methods]);
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
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}
