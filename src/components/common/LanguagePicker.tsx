
import { languages } from "../../i18n/ui";
import { createSignal, createEffect, Component, onMount } from "solid-js";
import { currentLanguage } from "../../lib/languageSelectionStore";


export const LanguagePicker: Component = () => {
  const [selectedLanguage, setSelectedLanguage] = createSignal('en');

  const handleLanguageChange = (e: Event) => {
    setSelectedLanguage((e.target as HTMLSelectElement).value);
    currentLanguage.set(selectedLanguage());
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
