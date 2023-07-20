/** @type {import('tailwindcss').Config} */

module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {},
		colors: {
			'primaryText': '#042A2B',
			'secondaryText': '#333333',
			'p': '#CDECF6',
			'click': '#D84727',
			'clickAction': '#EF7B45',
			'primaryBackground': '#5EB1BF',
			'secondaryBackground':'#042A2B',
			'accent': '#EF7B45',
			'border': '#CDEDF6',
			'primaryText-dark': '#',
			'secondaryText-dark': '#',
			'p-dark': '#',
			'link-dark': '#',
			'primaryBackground-dark': '#',
			'secondaryBackground-dark': '#',
			'accent-dark': '#',
			'border-dark': '#',
			'linkaction-dark': '#',
		}
	},
	plugins: [],
}
