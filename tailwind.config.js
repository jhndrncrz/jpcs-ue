/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
  	extend: {
  		colors: {
  			border: 'var(--border)',
            background: 'var(--background)',
            foreground: 'var(--foreground)',
            primary: {
                DEFAULT: 'var(--primary)',
                foreground: 'var(--primary-fg)'
            },
            secondary: {
                DEFAULT: 'var(--secondary)',
                foreground: 'var(--secondary-fg)'
            },
            accent: {
                DEFAULT: 'var(--accent)',
                foreground: 'var(--accent-fg)'
            }
  		},
        fontFamily: {
            logo: ['var(--font-logo)'],
            title: ['var(--font-title)'],
            heading: ['var(--font-heading)'],
            body: ['var(--font-body)']
        },
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		}
  	}
  },
  plugins: [],
}
