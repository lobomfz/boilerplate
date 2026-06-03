import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { FormProvider, useFormContext } from "react-hook-form";

import type { AuthSchemas } from "@/api/auth/schemas";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/use-login";

type LoginInput = typeof AuthSchemas.login.infer;

export const Route = createFileRoute("/login")({
	component: LoginPage,
});

function LoginPage() {
	return (
		<div
			data-component="login-page"
			className="flex min-h-screen items-center justify-center bg-background"
		>
			<Card className="w-full max-w-sm">
				<LoginCardHeader />

				<LoginCardContent>
					<LoginCardName />
					<LoginCardPassword />
					<LoginCardFooter />
				</LoginCardContent>
			</Card>
		</div>
	);
}

function LoginCardHeader() {
	return (
		<CardHeader>
			<CardTitle className="text-2xl font-bold">Boilerplate</CardTitle>
			<CardDescription>Enter your credentials to access</CardDescription>
		</CardHeader>
	);
}

function LoginCardContent({ children }: { children: React.ReactNode }) {
	const { methods, handleSubmit } = useLogin();

	return (
		<CardContent>
			<FormProvider {...methods}>
				<form onSubmit={handleSubmit} className="space-y-4">
					{children}
				</form>
			</FormProvider>
		</CardContent>
	);
}

function LoginCardName() {
	const {
		register,
		formState: { errors },
	} = useFormContext<LoginInput>();

	const nameError = errors.name?.message;

	return (
		<div className="space-y-2">
			<Label htmlFor="name">Name</Label>

			<Input
				id="name"
				type="text"
				placeholder="Your name"
				data-slot="name-input"
				className="bg-background border border-border"
				aria-invalid={!!nameError}
				{...register("name")}
				required
			/>

			{nameError && (
				<p data-component="login-name-error" className="text-sm text-red-500">
					{nameError}
				</p>
			)}
		</div>
	);
}

function LoginCardPassword() {
	const {
		register,
		formState: { errors },
	} = useFormContext<LoginInput>();
	const passwordError = errors.password?.message;

	return (
		<div className="space-y-2">
			<Label htmlFor="password">Password</Label>

			<Input
				id="password"
				type="password"
				placeholder="Your password"
				data-slot="password-input"
				className="bg-background border border-border"
				aria-invalid={!!passwordError}
				{...register("password")}
				required
			/>

			{passwordError && (
				<p data-component="login-password-error" className="text-sm text-red-500">
					{passwordError}
				</p>
			)}
		</div>
	);
}

function LoginCardFooter() {
	const {
		formState: { isSubmitting },
	} = useFormContext<LoginInput>();

	return (
		<Button
			type="submit"
			data-slot="submit"
			data-submitting={isSubmitting}
			className="w-full"
			disabled={isSubmitting}
		>
			<LogIn className="mr-2 size-4" />
			{isSubmitting && "Signing in..."}
			{!isSubmitting && "Sign in"}
		</Button>
	);
}
