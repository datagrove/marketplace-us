import { describe, it, expect, vi, test } from "vitest";
import "@testing-library/jest-dom"; // Extends `expect` with DOM matchers
// import OfflinePage from '@pages/Offline.astro'
import { render } from "@solidjs/testing-library";

// Mock the translation utility
vi.mock("../i18n/utils", () => ({
    useTranslations: () => (key: string) => {
        const translations = {
            "pageTitles.offline": "You are offline",
        };
        return translations[key];
    },
    getLangFromUrl: vi.fn(() => "en"), // Mock language detection if needed
}));

test.todo("Offline Page", () => {
    it("renders with the correct title and structure", async () => {
        const { getByText } = render(<OfflinePage />);

        // Assert that the page title is rendered
        expect(getByText("You are offline")).toBeInTheDocument();

        // Check the structure and CSS classes
        const titleElement = getByText("You are offline");
        expect(titleElement).toHaveClass(
            "text-5xl text-center m-4 text-ptext1 dark:text-ptext1-DM"
        );
    });
});
