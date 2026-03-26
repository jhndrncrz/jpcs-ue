import { Moon, Sun } from "lucide-react"
import { useTheme } from "../context/ThemeContext"

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  return (
    <button 
      onClick={toggleTheme} 
      className="relative inline-flex items-center justify-center w-10 h-10 hover:bg-[var(--surface)] transition-colors text-[var(--foreground)]"
      title={`Current theme: ${theme}`}
      aria-label="Toggle theme"
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
