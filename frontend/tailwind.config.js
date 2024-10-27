/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ["class"],
	content: [
	  './index.html',
	  './src/**/*.{js,jsx,ts,tsx}',
	  './node_modules/@shadcn/ui/**/*.{js,jsx,ts,tsx}',
	],
	theme: {
	  container: {
		center: true,  // Removed the quotes around `true`
		padding: '2rem',
		screens: {
		  '2xl': '1400px',
		},
	  },
	  extend: {
		colors: {
		  // Custom color palette (replace this with your actual custom colors)
		  primary: {
			DEFAULT: '#4A90E2',  // Replace with your primary color
			dark: '#003366',     // Dark variant of the primary color
			light: '#B3D4FC',    // Light variant of the primary color
		  },
		  secondary: {
			DEFAULT: '#50E3C2',  // Replace with your secondary color
			dark: '#00796B',
			light: '#B2DFDB',
		  },
		  neutral: {
			DEFAULT: '#9E9E9E',
			light: '#E0E0E0',
			dark: '#616161',
		  },
		  accent: {
			DEFAULT: '#FF4081',  // Example accent color
		  },
		},
		borderRadius: {
		  lg: 'var(--radius)',    // Using CSS variables or fixed values
		  md: 'calc(var(--radius) - 2px)',
		  sm: 'calc(var(--radius) - 4px)',
		},
		fontFamily: {
		  // Custom font family (replace "var(--font-sans)" with your font variables or values)
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
	plugins: [require('tailwindcss-animate')],
  };