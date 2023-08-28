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
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import remarkToc from "remark-toc";
import rehypeSlug from 'rehype-slug';

const locales = languages;
const defaultLocale = defaultLang;


// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
  site: SITE.url,
  trailingSlash: 'never',
  build: {
    format: 'file'
  },
  markdown: {
    remarkPlugins: [remarkToc],
    rehypePlugins: [rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'append' }]],
  },
  integrations: [solid(), tailwind(), icon({
    iconDir: "src/assets",
    include: {
      tabler: ["*"]
    }
  }), i18n({
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
  }), mdx()],

  // vite: {
  //   define: {
  //     'process.env.PUBLIC_VITE_SUPABASE_URL': JSON.stringify(process.env.PUBLIC_VITE_SUPABASE_URL),
  //     'process.env.PUBLIC_VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.PUBLIC_VITE_SUPABASE_ANON_KEY),
  //   }
  // },  
});