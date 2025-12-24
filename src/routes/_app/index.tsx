import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";

import { orpc } from "@/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLogout } from "@/hooks/use-logout";

export const Route = createFileRoute("/_app/")({
  component: HomePage,
});

function HomePage() {
  const { data: user } = useSuspenseQuery(orpc.auth.me.queryOptions());
  const { logout } = useLogout();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Olá, {user?.name}</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-muted-foreground mb-4">Você está logado no sistema.</p>

          <Button variant="outline" onClick={logout} className="w-full">
            <LogOut className="mr-2 size-4" />
            Sair
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
