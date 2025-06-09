
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
    } else {
      setTheme("light");
    }
  };

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
      className="rounded-full w-10 h-10 border-muted-foreground/20 bg-background/80 backdrop-blur-sm transition-all duration-300 ease-in-out"
    >
      {theme === "light" ? (
        <Sun className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] transition-all duration-300" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
