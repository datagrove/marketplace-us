import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import tailwind from "@astrojs/tailwind";
import { i18n, defaultLocaleSitemapFilter } from 'astro-i18n-aut';
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import { defaultLang, languages } from './src/i18n/ui';
import { SITE } from './src/config';


const locales = languages;
const defaultLocale = defaultLang;


// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [solid(), tailwind(), i18n({
    locales,
    defaultLocale
  }), sitemap({
    i18n: {
      locales,
      defaultLocale
    },
    filter: defaultLocaleSitemapFilter({
      defaultLocale
    })
  })],
  adapter: cloudflare(),
  experimental: {
    redirects: true
  },
  site: SITE.url,
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  vite: {
    define: {
      'process.env.API_URL': JSON.stringify(process.env.API_URL),
      'process.env.anon_key': JSON.stringify(process.env.anon_key),
      'process.env.PUBLIC_STRIPE_API': JSON.stringify(process.env.PUBLIC_STRIPE_API),
      'process.env.PRIVATE_STRIPE_API': JSON.stringify(process.env.PRIVATE_STRIPE_API),
      'process.env.PRIVATE_STRIPE_ENDPOINT': JSON.stringify(process.env.PRIVATE_STRIPE_ENDPOINT),
    }
  }  
});