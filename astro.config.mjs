import { defineConfig } from 'astro/config';
import solid from '@astrojs/solid-js';
import tailwind from "@astrojs/tailwind";
import { i18n, defaultLocaleSitemapFilter } from 'astro-i18n-aut/integration';
import sitemap from '@astrojs/sitemap';
import cloudflare from "@astrojs/cloudflare";
import { defaultLang, languages } from './src/i18n/ui';
import { SITE } from './src/config';
import icon from "astro-icon";
import mdx from "@astrojs/mdx";
import { VitePWA } from "vite-plugin-pwa";
import AstroPWA from "@vite-pwa/astro"
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkToc from "remark-toc";
import rehypeSlug from 'rehype-slug';
import compress from "astro-compress";
const locales = languages;
const defaultLocale = defaultLang;


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: SITE.pagesDevUrl,
  trailingSlash: 'never',
  build: {
    format: 'file',
    inlineStylesheets: 'always',
  },
  markdown: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, {
      behavior: 'append'
    }]]
  },
  integrations: [
    solid(), 
    tailwind(), 
    icon({
      iconDir: "src/assets",
      include: {
        tabler: ["*"]
      }
    }), 
    i18n({
      locales,
      defaultLocale,
      exclude: ['pages/offline.astro', 'pages/fr/*', 'pages/es/*', 'pages/en/*', 'pages/api/*'],
    }),
    sitemap({
      i18n: {
        locales,
        defaultLocale,
        exclude: ['pages/offline.astro', 'pages/fr/*', 'pages/es/*', 'pages/en/*', 'pages/api/*'],
      },
      filter: defaultLocaleSitemapFilter({
        defaultLocale
      }) 
  }), mdx(), compress()]

//   vite: {
//   //   define: {
//   //     'process.env.PUBLIC_VITE_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_VITE_SUPABASE_URL),
//   //     'process.env.PUBLIC_VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_VITE_SUPABASE_ANON_KEY),
//   //   }
//  },  
});