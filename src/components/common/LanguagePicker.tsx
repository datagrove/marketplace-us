
import { languages } from "../../i18n/ui";
import { createSignal, createEffect, Component, onMount } from "solid-js";
import { currentLanguage } from "../../lib/languageSelectionStore";
import { useNavigate } from "@solidjs/router";


export const LanguagePicker: Component = () => {
  const [selectedLanguage, setSelectedLanguage] = createSignal('en');

  const handleLanguageChange = (e: Event) => {
    setSelectedLanguage((e.target as HTMLSelectElement).value);
    currentLanguage.set(selectedLanguage());
    const path = window.location.pathname.split('/');
    console.log(path)
      path[0] = selectedLanguage();
    console.log(path.join('/'))
    window.location.href = path.join('/');
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
