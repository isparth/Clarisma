// Import the required plugin for ES modules
import tailwindcssAnimate from 'tailwindcss-animate';

export default {
	darkMode: ["class"],
	content: [
	  './index.html',
	  './src/**/*.{js,jsx,ts,tsx}',
	  './node_modules/@shadcn/ui/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
	  container: {
		center: true,
		padding: '2rem',
		screens: {
		  '2xl': '1400px',
		},
	  },
	  extend: {
		colors: {
		  primary: {
			DEFAULT: '#4A90E2',
			dark: '#003366',
			light: '#B3D4FC',
		  },
		  secondary: {
			DEFAULT: '#50E3C2',
			dark: '#00796B',
			light: '#B2DFDB',
		  },
		  neutral: {
			DEFAULT: '#9E9E9E',
			light: '#E0E0E0',
			dark: '#616161',
		  },
		  accent: {
			DEFAULT: '#FF4081',
		  },
		},
		borderRadius: {
		  lg: 'var(--radius)',
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)',
		},
		fontFamily: {
		  sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
		  serif: ['Merriweather', 'serif'],
		},
		keyframes: {
		  'accordion-down': {
			from: { height: '0' },
			to: { height: 'var(--radix-accordion-content-height)' },
		  },
		  'accordion-up': {
			from: { height: 'var(--radix-accordion-content-height)' },
			to: { height: '0' },
		  },
		},
		animation: {
		  'accordion-down': 'accordion-down 0.2s ease-out',
		  'accordion-up': 'accordion-up 0.2s ease-out',
		},
	  },
	},
	// Use the imported plugin
	plugins: [tailwindcssAnimate],
};