import { describe, it, expect, vi, beforeAll, test } from "vitest";
import { render, screen } from "@solidjs/testing-library";
import { ViewCard } from "@components/services/ViewCard";

import type { Post } from "@lib/types";

// Mock external dependencies
vi.mock("@lib/supabaseClient", () => ({
    supabase: {
        auth: {
            getSession: vi.fn(() => ({ data: { session: null }, error: null })),
        },
    },
}));

vi.mock("../../i18n/utils", () => ({
    useTranslations: vi.fn(() => (key: string) => {
        return key === "someKey" ? "some translation" : key;
    }),
    getLangFromUrl: vi.fn(() => "en"),
}));

// Mock Lazy Loading Image
vi.mock("@lib/imageHelper", () => ({
    lazyLoadImage: vi.fn(),
}));

// Mock the components used in ViewCard
vi.mock("../posts/DeletePostButton", () => ({
    DeletePostButton: () => <div>Delete Button</div>,
}));

vi.mock("../common/cart/AddToCartButton", () => ({
    AddToCart: () => <div>Add To Cart</div>,
}));

vi.mock("@components/posts/AddFavorite", () => ({
    FavoriteButton: () => <div>Favorite Button</div>,
}));

vi.mock("@components/posts/RemoveFavorite", () => ({
    RemoveFavoriteButton: () => <div>Remove Favorite Button</div>,
}));

vi.mock("@components/posts/AverageRatingStars", () => ({
    AverageRatingStars: () => <div>Average Rating Stars</div>,
}));

describe("ViewCard", () => {
    const mockPosts: Post[] = [
        {
            id: 1,
            title: "Post 1",
            content: "This is post 1",
            user_id: "user_1",
            image_urls: ["image1.jpg"],
            seller_name: "Seller 1",
            seller_id: "user_1",
            email: "seller1@example.com",
            price_id: "price_1",
            product_id: "product_1",
            subjects: [1],
            grades: [2],
            resource_types: [1],
            subtopics: [1],
            listing_status: true,
            secular: true,
            draft_status: false,
            resource_urls: "",
            unit_amount: 20,
            resource_links: [],
            subject: null,
            subtopic: null,
            grade: null,
            resourceTypes: null,
            image_url: { webpUrl: "image1.webp", jpegUrl: "image1.jpg" },
            seller_img: { webpUrl: "seller1.webp", jpegUrl: "seller1.jpg" },
            image_signedUrls: [
                { webpUrl: "image1_signed.webp", jpegUrl: "image1_signed.jpg" },
            ],
            price: 10,
            quantity: 1,
        },
    ];

    test.todo("should render the component with posts", async () => {
        render(() => <ViewCard posts={mockPosts} />);

        // Check that the post title is displayed
        //
        expect(screen.getByText("Post 1")).toBeInTheDocument();
        screen.debug();

        // Check that the translation key is being passed correctly
    });

    test.todo("should call setSession when user session changes", async () => {
        render(() => <ViewCard posts={mockPosts} />);

        // Check that the session is being set correctly
        expect(screen.queryByText("Favorite Button")).toBeInTheDocument();
    });

    test.todo('should show "Delete Button" component when present', () => {
        render(() => <ViewCard posts={mockPosts} />);
        expect(screen.getByText("Delete Button")).toBeInTheDocument();
    });

    // Add more tests for other behaviors and interactions
});
