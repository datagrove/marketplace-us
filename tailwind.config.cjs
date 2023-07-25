/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			colors: {
				'background1': '#FFFFFF',
				'background2': '#F4F4F4',
				'btn1': '#1DD360',
				'btn1hov': '#44B56E',
				'btn2': '#BCBCBC',
				'btn2hov': '#999999',
				'link1': '#000000',
				'link1hov': '',
				'link2': '#999999',
				'link2hov': '',
				'text1': '#000000',
				'text2': '#073116',
				'border': '#7E9E85',
				'logo': '#000000',
				'background1-DM': '#121212',
				'background2-DM': '#013220',
				'btn1-DM': '#1DD762',
				'btn1hov-DM': '#72E99C',
				'btn2-DM': '#BCBCBC',
				'btn2hov-DM': '#CFCFCF',
				'link1-DM': '#F0F0F0',
				'link2-DM': '#1DD762',
				'text1-DM': '#F0F0F0',
				'text2-DM': '#2E2E2E',
				'border-DM': '#F0F0F0',
				'logo-DM': '#F0F0F0',
			}
		},
	},
	plugins: [],
}