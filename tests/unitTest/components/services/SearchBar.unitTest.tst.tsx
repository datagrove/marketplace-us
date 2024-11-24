import { test, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";

vi.mock("../../i18n/utils", () => ({
    getLangFromUrl: () => "en",
    useTranslations: () => (key: string) => {
        const translations = {
            "pageTitles.signUp": "Sign Up",
        };
        return translations[key] || key;
    },
}));

vi.stubGlobal("location", {
    href: "",
});

const user = userEvent.setup();

test.todo("check that searchBar renders", () => {});

test.todo("searchBar button is loaded empty", () => {});
test.todo(
    "searchBar button is disabled when there placeholder is empty",
    () => {}
);
test.todo("searchBar placeholder allows to fill with new string", () => {});
test.todo(
    "searchBar button is enable when the placeholder contains a string ",
    () => {}
);
