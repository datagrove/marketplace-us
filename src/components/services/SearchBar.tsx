import { Component, createSignal } from 'solid-js'
import { supabase } from '../../lib/supabaseClient'
import type { AuthSession } from '@supabase/supabase-js'
import { getLangFromUrl, useTranslations } from '../../i18n/utils';

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
  // Define the type for the filterPosts prop
  search: (searchString: string) => void;
}

export const SearchBar: Component<Props> = (props) => {
  const [searchString, setSearchString] = createSignal<string>('');

  // const searchPosts = async () => {
  //   console.log(searchString());
  //   if (searchString() === '') {
  //     const { data, error } = await supabase
  //       .from('providerposts')
  //       .select()
  //     if (error) {
  //       console.log("supabase error: " + error.message);
  //     } else {
  //       console.log(data)
  //     }
  //   } else {
  //     const { data, error } = await supabase
  //       .from('providerposts')
  //       .select()
  //       .textSearch('title_content', searchString());

  //     if (error) {
  //       console.log("supabase error: " + error.message);
  //     } else {
  //       console.log(data)
  //     }
  //   }
  // }

  return (
    <div class="search-form">
      <div class="form">
        <input type="text" name="query" placeholder={t('formLabels.search')} oninput={(e) => setSearchString(e.target.value)} />
        <button class="btn-primary mx-6" onclick={(e) => props.search(searchString())}>{t('formLabels.search')}</button>
      </div>
    </div>
  )
}
