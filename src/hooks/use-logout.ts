import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { orpc } from "@/client";

export function useLogout() {
	const navigate = useNavigate();
	const queryClient = useQueryClient();
	const { mutateAsync } = useMutation(orpc.auth.logout.mutationOptions());

	async function logout() {
		await mutateAsync({});
		queryClient.clear();
		await navigate({ to: "/login", replace: true });
	}

	return { logout };
}
