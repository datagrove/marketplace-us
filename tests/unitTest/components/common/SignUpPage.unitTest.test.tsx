import "@testing-library/jest-dom";
import SignUpPage from "@src/pages/signup.astro";
import { describe, it, vi } from "vitest";
import { render } from "@solidjs/testing-library";

vi.mock("../lib/Auth", () => ({
    Auth: () => <div data-testid="auth-form">Auth Form Mock</div>,
}));

vi.mock("@i18n/utils", () => ({
    getLangFromUrl: vi.fn(() => "en"),
    useTranslations: vi.fn(() => (key) => {
        const translations = {
            "pageTitles.signUp": "Sign Up",
            "pageDescriptions.signUp": "Sign up for an account",
        };
        return translations[key];
    }),
}));

describe("SignUp Page", () => {
    it("sign up page renders", async () => {
        const { getByText, getByTestId } = await render(SignUpPage, {
            props: {
                Astro: { url: new URL("https://localhost:4321/en/sign-up") },
            },
        });

        // Check page title
        expect(getByText("Sign Up")).toBeInTheDocument();

        // Check auth form is rendered
        expect(getByTestId("auth-form")).toBeInTheDocument();
    });
});
