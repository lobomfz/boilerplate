import { FormProvider, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/lib/schemas";
import { useMutation } from "@tanstack/react-query";
import { orpc } from "@/client";
import type { LoginInput } from "@/types/auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";

export function useLogin() {
  const { mutateAsync } = useMutation(orpc.auth.login.mutationOptions());

  const navigate = useNavigate();

  const methods = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit: SubmitHandler<LoginInput> = async (data) => {
    try {
      await mutateAsync(data);

      await navigate({ to: "/" });
    } catch {
      toast.error("Erro ao fazer login", {
        description: "Nome ou senha inválidos",
        position: "bottom-left",
      });
    }
  };

  return {
    methods,
    onSubmit,
    FormProvider,
  };
}
