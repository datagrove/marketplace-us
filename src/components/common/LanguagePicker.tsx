
import { languages } from "../../i18n/ui";
import { createSignal, createEffect, Component, onMount } from "solid-js";
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import language from '../../assets/language.svg'

const lang = getLangFromUrl(new URL(window.location.href));

const icon = language
export const LanguagePicker: Component = () => {
  const [selectedLanguage, setSelectedLanguage] = createSignal<string>(lang);
  const [selectedValue, setSelectedValue] = createSignal('');

  const handleLanguageChange = (e: Event) => {
    setSelectedLanguage((e.target as HTMLSelectElement).value);

    const path = window.location.pathname.split('/');
    console.log(window.location.pathname)

    if (path[1] === '') {
      console.log("Path Index 1 blank")
      path[0] = selectedLanguage();
      window.location.href = path[0];
    } else if (path[1] === selectedLanguage()) {
      console.log("Already at Language")
      window.location.href = window.location.href;
    } else if (Object.keys(languages).includes(path[1])) {
      console.log("Path Index 1 contains a language")
      console.log(path)
      path[1] = selectedLanguage();
      console.log(path.join('/'))
      window.location.href = window.location.origin + path.join('/');
    } else {
      console.log("Path Index 1 doesn't contain a language")
      console.log(path)
      path[0] = selectedLanguage();
      console.log(path.join('/'))
      window.location.href = '/' + path.join('/')
    }
  }

  return (
    <div class="flex rounded-lg text-ptext1 dark:text-ptext1-DM focus:border-border1 dark:focus:border-border1-DM focus:outline-none mr-4">
      <img src={icon} alt="language icon" class="bg-background1 dark:bg-background1-DM rounded-l-lg pl-2" />
      <select 
      id="language" 
      class='bg-background1 dark:bg-background1-DM rounded-r-lg '
      value={selectedLanguage()} 
      onChange={handleLanguageChange}
      >
        {Object.entries(languages).map(([lang, label]) => (
          <option value={lang}>{label}</option>
        ))}
      </select>
    </div>
  );
}
