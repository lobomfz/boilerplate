import { z } from "zod";

export const loginSchema = z.object({
  name: z.string({ error: "Nome é obrigatório" }).min(1, "Nome é obrigatório"),
  password: z.string({ error: "Senha é obrigatória" }).min(1, "Senha é obrigatória"),
});
