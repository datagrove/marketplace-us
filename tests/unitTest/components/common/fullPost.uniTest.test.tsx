import type { Post } from "@lib/types";

const mockPost: Post = {
    id: 1,
    title: "Test Post",
    content: "<p>Test</p>",
    user_id: "testUser123",
    image_urls: ["test.jpg", "test.jpg"],
    seller_name: "Test Seller Name",
    seller_id: "test123",
    email: "test@test123.com",
    price_id: "price_123",
    product_id: "prod_123",
    subjects: [1, 2],
    grades: [3, 4],
    resource_types: [5],
    subtopics: [0],
    listing_status: true,
    secular: false,
    draft_status: false,
    resource_urls: "testUrl.url",
    unit_amount: 1,
    resource_links: ["testUrl.url"],
    subject: ["Math", "Science"],
    subtopic: ["Algebra", "Physics"],
    grade: ["Grade 9", "Grade 10"],
    resourceTypes: ["Worksheet"],
    image_url: { webpUrl: "testWebpUrl", jpegUrl: "testJpegUrl" },
    seller_img: { webpUrl: "testWebpUrl", jpegUrl: "testJpegUrl" },
    image_signedUrls: [{ webpUrl: "testWebpUrl", jpegUrl: "testJpegUrl" }],
    price: 10.0,
    quantity: 1,
};
