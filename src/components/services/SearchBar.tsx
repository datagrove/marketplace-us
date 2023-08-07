import { Component, Suspense, createEffect, createResource, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import type { AuthSession } from '@supabase/supabase-js'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const SearchBar: Component = () => {
  
  return (
    <div class="search-form">
    <div class="form">
      <input type="text" name="query" placeholder={t('formLabels.search')} />
    </div>
  </div>
  )
}
