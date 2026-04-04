import type { Config } from 'tailwindcss';

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
      screens: { '2xl': '1400px' },
    },
    extend: {
      fontFamily: {
        sans:     ['Manrope', 'sans-serif'],
        body:     ['Manrope', 'sans-serif'],
        headline: ['Manrope', 'sans-serif'],
        code:     ['monospace'],
      },
      colors: {
        /* ── Stitch surface hierarchy ── */
        'surface':                   '#f9f9f8',
        'surface-bright':            '#f9f9f8',
        'surface-dim':               '#dadad9',
        'surface-container':         '#eeeeed',
        'surface-container-low':     '#f3f4f3',
        'surface-container-lowest':  '#ffffff',
        'surface-container-high':    '#e8e8e7',
        'surface-container-highest': '#e2e2e2',
        'surface-variant':           '#e2e2e2',
        'on-surface':                '#1a1c1c',
        'on-surface-variant':        '#3f4944',
        'on-background':             '#1a1c1c',

        /* ── Stitch primary — deep forest green ── */
        'stitch-primary':            '#004532',
        'stitch-primary-container':  '#065f46',
        'stitch-primary-fixed':      '#a6f2d1',
        'stitch-primary-fixed-dim':  '#8bd6b6',
        'on-stitch-primary':         '#ffffff',
        'on-stitch-primary-fixed':   '#002116',
        'on-stitch-primary-fixed-variant': '#00513b',

        /* ── Stitch secondary — teal ── */
        'stitch-secondary':              '#006a61',
        'stitch-secondary-container':    '#86f2e4',
        'stitch-secondary-fixed':        '#89f5e7',
        'stitch-secondary-fixed-dim':    '#6bd8cb',
        'on-stitch-secondary':           '#ffffff',
        'on-stitch-secondary-container': '#006f66',
        'on-stitch-secondary-fixed':     '#00201d',

        /* ── Stitch tertiary ── */
        'stitch-tertiary':           '#333f39',
        'stitch-tertiary-container': '#4a564f',
        'stitch-tertiary-fixed':     '#d9e6dd',
        'stitch-tertiary-fixed-dim': '#bdcac1',

        /* ── Outline ── */
        'outline':         '#6f7973',
        'outline-variant': '#bec9c2',

        /* ── Inverse ── */
        'inverse-surface':    '#2f3130',
        'inverse-on-surface': '#f1f1f0',
        'inverse-primary':    '#8bd6b6',

        /* ── Error ── */
        'error':           '#ba1a1a',
        'error-container': '#ffdad6',
        'on-error':        '#ffffff',
        'on-error-container': '#93000a',

        /* ── Shadcn tokens ── */
        background:  'rgb(var(--background) / <alpha-value>)',
        foreground:  'rgb(var(--foreground) / <alpha-value>)',
        card: {
          DEFAULT:    'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT:    'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
        primary: {
          DEFAULT:    'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT:    'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:    'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT:    'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT:    'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        border: 'rgb(var(--border) / <alpha-value>)',
        input:  'rgb(var(--input) / <alpha-value>)',
        ring:   'rgb(var(--ring) / <alpha-value>)',
        chart: {
          '1': 'rgb(var(--chart-1) / <alpha-value>)',
          '2': 'rgb(var(--chart-2) / <alpha-value>)',
          '3': 'rgb(var(--chart-3) / <alpha-value>)',
          '4': 'rgb(var(--chart-4) / <alpha-value>)',
          '5': 'rgb(var(--chart-5) / <alpha-value>)',
        },
        sidebar: {
          DEFAULT:              'hsl(var(--sidebar-background))',
          foreground:           'hsl(var(--sidebar-foreground))',
          primary:              'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent:               'hsl(var(--sidebar-accent))',
          'accent-foreground':  'hsl(var(--sidebar-accent-foreground))',
          border:               'hsl(var(--sidebar-border))',
          ring:                 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up':   'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;
