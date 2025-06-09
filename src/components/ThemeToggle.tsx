
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/ThemeProvider";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("light");
    } else {
      // If theme is "system", default to light
      setTheme("light");
    }
  };

  // Determine if we should show dark mode icons
  const isDark = mounted && (
    theme === "dark" || 
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="rounded-full w-10 h-10 border-muted-foreground/20 bg-background/80 backdrop-blur-sm"
      >
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className="rounded-full w-10 h-10 border-muted-foreground/20 bg-background/80 backdrop-blur-sm transition-all duration-500 ease-in-out"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-500 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'}`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-500 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
