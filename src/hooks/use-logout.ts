import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { orpc } from "@/client";
import { queryClient } from "@/main";

export function useLogout() {
  const navigate = useNavigate();

  const { mutateAsync } = useMutation(
    orpc.auth.logout.mutationOptions({
      onSuccess: () => queryClient.invalidateQueries(),
    }),
  );

  async function logout() {
    await mutateAsync({});
    await navigate({ to: "/login" });
  }

  return { logout };
}
