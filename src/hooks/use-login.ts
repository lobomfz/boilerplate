import { arktypeResolver } from "@hookform/resolvers/arktype";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { type SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { AuthSchemas } from "@/api/auth/schemas";
import { orpc } from "@/client";

type LoginInput = typeof AuthSchemas.login.infer;

export function useLogin() {
	const navigate = useNavigate();
	const { mutateAsync } = useMutation(orpc.auth.login.mutationOptions());

	const methods = useForm<LoginInput>({
		resolver: arktypeResolver(AuthSchemas.login),
	});

	const onSubmit: SubmitHandler<LoginInput> = async (data) => {
		await mutateAsync(data)
			.then(() => navigate({ to: "/", replace: true }))
			.catch(() => {
				toast.error("Login failed", {
					description: "Invalid name or password",
					position: "bottom-left",
				});
			});
	};

	return {
		methods,
		handleSubmit: methods.handleSubmit(onSubmit),
	};
}
