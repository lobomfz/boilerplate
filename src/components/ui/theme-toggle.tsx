import { Moon, Sun } from "lucide-react";

import { useThemeStore } from "@/stores/theme";

import { Button } from "./button";

export function ThemeToggle() {
	const theme = useThemeStore((s) => s.theme);
	const toggleTheme = useThemeStore((s) => s.toggleTheme);

	return (
		<Button
			data-component="theme-toggle"
			data-theme={theme}
			variant="outline"
			size="icon"
			onClick={toggleTheme}
			aria-label="Toggle theme"
		>
			{theme === "dark" && <Sun className="size-5 text-foreground" />}
			{theme !== "dark" && <Moon className="size-5 text-foreground" />}
		</Button>
	);
}
