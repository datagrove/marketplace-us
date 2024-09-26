import type { ui } from "@i18n/ui.ts";

export interface Post {
    //Posts should be pulled from the sellerposts view
    id: number; //Post ID used for directing to the post details page
    title: string; //Title of the post
    content: string; //Main body of the post (HTML)
    user_id: string; //User ID of the seller
    image_urls: Array<string>; //Array of image URLs for the post
    seller_name: string; //Name of the seller
    seller_id: string; //User ID of the seller, used for directing to the seller details page
    email: string; //Email of the seller
    price_id: string; //Stripe Price ID of the post
    product_id: string; //Stripe Product ID of the post
    subjects: Array<number>; //Array of subject IDs, does not contain actual subject names
    grades: Array<number>; //Array of grade IDs, does not contain actual grade names
    resource_types: Array<number>; // Array of resource types IDs, does not contain actual resource_types names
    subtopics: Array<number>; //Array of subtopic IDs
    listing_status: boolean; //Boolean of whether the post is listed or not
    secular: boolean;
    draft_status: boolean;
    resource_urls: string;
    unit_amount: number;
    resource_links: string[];

    //These fields are not stored in the database and must be fetched from stripe (price) or set by the code
    subject: Array<string> | null;
    subtopic: Array<string> | null; //Array of subject names
    grade: Array<string> | null; //Array of grade names
    resourceTypes: Array<string> | null; //Array of resourceTypes names
    image_url: {webpUrl: string, jpegUrl: string} | undefined; //Actual images for the post DOES NOT COME FROM DATABASE
    seller_img: {webpUrl: string, jpegUrl: string} | undefined; //Profile Image of the seller
    image_signedUrls: {webpUrl: string, jpegUrl: string}[];
    price: number; //Price of the post
    quantity: number; //Quantity to add to cart from post
}

export interface PurchasedPost extends Post {
    purchaseDate: string;
    created_at: string;
}

export interface User {
    display_name: string;
    user_id: string;
    image_url: string | null;
    email: string;
    created_at: string;
    first_name: string;
    last_name: string;
}

export interface Creator {
    seller_name: string;
    seller_id: number;
    user_id: string;
    image_url: string | null;
    email: string;
    created_at: string;
    first_name: string;
    last_name: string;
    seller_about: string;
    contribution: number;
}

export interface FilterPostsParams {
    subjectFilters?: number[]; 
    gradeFilters?: number[];   
    searchString?: string;
    resourceFilters?: number[]; 
    secularFilter?: boolean;
    lang: "en" | "es" | "fr";   
    limit?: number;
    draft_status?: boolean;
    listing_status?: boolean;
    orderAscending?: boolean;
    user_id?: string;
    post_id?: number[];
    seller_id?: string;
    from?: number;
    to?: number;
    downloadable?: boolean;
    subtopics?: number[];
}

export interface Orders{
    order_number: number;
    order_date: number;
    customer_id: number;
    order_status: boolean;
}

export interface Order_Details{
    order_number: number;
    product_id: number;
    quantity: number;
}

export interface Review{
        resource_id : string,
        reviewer_id: string,
        review_title: string,
        review_text: string,
        overall_rating :number,
}

