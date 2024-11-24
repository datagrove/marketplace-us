import { CategoryCarousel } from "@components/services/CategoryCarousel";
import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vitest"; // Use vitest for mocking if needed

// Mock the necessary assets since we're testing the logic, not the actual images
vi.mock(
    "../../assets/categoryIcons/circled-right-arrow.svg",
    () => "right-arrow.svg"
);
vi.mock(
    "../../assets/categoryIcons/circled-left-arrow.svg",
    () => "left-arrow.svg"
);
vi.mock("../../assets/categoryIcons/history.svg", () => "history-icon.svg");
vi.mock("../../assets/categoryIcons/art.svg", () => "art-icon.svg");
vi.mock("../../assets/categoryIcons/geography.svg", () => "geography-icon.svg");
vi.mock("../../assets/categoryIcons/math.svg", () => "math-icon.svg");
vi.mock("../../assets/categoryIcons/science.svg", () => "science-icon.svg");
vi.mock("../../assets/categoryIcons/specialty.svg", () => "specialty-icon.svg");
vi.mock("../../assets/categoryIcons/holiday.svg", () => "holiday-icon.svg");
vi.mock("../../assets/categoryIcons/social.svg", () => "social-icon.svg");

// Mock the supabase call to return predefined data
vi.mock("../../lib/supabaseClient", () => ({
    from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
            order: vi.fn().mockReturnValue({
                data: [
                    { id: 1, subject: "Geography" },
                    { id: 2, subject: "History" },
                    { id: 3, subject: "Art" },
                    { id: 4, subject: "Holiday" },
                    { id: 5, subject: "Math" },
                    { id: 6, subject: "Science" },
                    { id: 7, subject: "Social" },
                    { id: 8, subject: "Specialty" },
                ],
                error: null,
            }),
        }),
    }),
}));

describe("CategoryCarousel Component", () => {
    it("should render the carousel with buttons and icons", async () => {
        const filterPosts = vi.fn();
        const { container } = render(() => (
            <CategoryCarousel filterPosts={filterPosts} />
        ));

        // Check if carousel renders and buttons are available
        expect(
            container.querySelector(".product-carousel")
        ).toBeInTheDocument();
        const buttons = container.querySelectorAll(".catBtn");
        expect(buttons).toHaveLength(8); // Should match the number of subjects

        // Check if icons are rendered
    });

    it("should call filterPosts when a button is clicked", async () => {
        const filterPosts = vi.fn();
        render(() => <CategoryCarousel filterPosts={filterPosts} />);

        // Click on the first subject button
        const button = screen.getByText(/Geography/i).closest("button");
        expect(button).toBeInTheDocument();

        fireEvent.click(button!);

        // Check if filterPosts was called with the correct argument (subject ID)
        expect(filterPosts).toHaveBeenCalledWith("1");

        // Check if the clicked button has 'selected' class
        expect(button).toHaveClass("selected");
    });

    it("should toggle the selected class when clicking on a button again", async () => {
        const filterPosts = vi.fn();
        render(() => <CategoryCarousel filterPosts={filterPosts} />);

        // Click on a subject button
        const button = screen.getByText(/Geography/i).closest("button");
        fireEvent.click(button!);

        // Ensure 'selected' class is added after the first click
        expect(button).toHaveClass("selected");

        // Click again on the same button
        fireEvent.click(button!);

        // Ensure 'selected' class is removed after the second click
        expect(button).not.toHaveClass("selected");
    });
});
