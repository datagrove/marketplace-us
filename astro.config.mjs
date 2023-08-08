import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import tailwind from "@astrojs/tailwind";
import { i18n, defaultLocaleSitemapFilter } from 'astro-i18n-aut/integration';
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import { defaultLang, languages } from './src/i18n/ui';
import { SITE } from './src/config';
import icon from "astro-icon"


const locales = languages;
const defaultLocale = defaultLang;


// https://astro.build/config
export default defineConfig({
  output: 'server',
  integrations: [solid(), tailwind(), 
    icon({
      iconDir: "src/assets",
      include: {
        tabler: ["*"],
      }
    }), 
    i18n({
    locales,
    defaultLocale
  }), 
  sitemap({
    i18n: {
      locales,
      defaultLocale
    },
    filter: defaultLocaleSitemapFilter({
      defaultLocale
    })
  })],
  adapter: cloudflare(),
  site: SITE.url,
  trailingSlash: 'never',
  build: {
    format: 'file'
  }
});