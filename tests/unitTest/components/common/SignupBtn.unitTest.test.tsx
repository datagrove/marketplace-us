import { test, expect, vi } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import userEvent from "@testing-library/user-event";
import { SignUpBtn } from "@components/common/SignUpButton";

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

test("signUpIsRendering", () => {
    render(() => <SignUpBtn />);
    const button = screen.getByRole("button", { name: "Sign Up" });
    expect(button).toBeInTheDocument();

    screen.debug();

    // await user.click(button)
    // expect(window.location.href).toBe("/en/signup");
});

test("sign up button is enable", () => {
    render(() => <SignUpBtn />);
    const button = screen.getByRole("button", { name: "Sign Up" });
    expect(button).toBeEnabled();

    screen.debug();

    // await user.click(button)
    // expect(window.location.href).toBe("/en/signup");
});

test("test signUp button redirection is working", async () => {
    render(() => <SignUpBtn />);
    const button = screen.getByRole("button", { name: "Sign Up" });
    expect(button).toBeInTheDocument();

    screen.debug();

    await user.click(button);
    expect(window.location.href).toBe("/en/signup");
});
