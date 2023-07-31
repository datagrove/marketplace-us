
import { languages } from "../../i18n/ui";
import { createSignal, createEffect, Component, onMount } from "solid-js";
import { currentLanguage } from "../../lib/languageSelectionStore";
import { getLangFromUrl, useTranslations } from '../../i18n/utils';
import { SITE } from '../../config';

const lang = getLangFromUrl(new URL(window.location.href));

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
    <div>
      <select id="language" value={selectedLanguage()} onChange={handleLanguageChange}>
        {Object.entries(languages).map(([lang, label]) => (
          <option value={lang}>{label}</option>
        ))}
      </select>
    </div>
  );
}
