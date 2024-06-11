export interface Post {
    //Posts should be pulled from the sellerposts view
    id: number; //Post ID used for directing to the post details page
    title: string; //Title of the post
    content: string; //Main body of the post (HTML)
    user_id: string; //User ID of the seller
    image_urls: string | null; //Array of image URLs for the post
    seller_name: string; //Name of the seller
    seller_id: string; //User ID of the seller, used for directing to the seller details page
    email: string; //Email of the seller
    price_id: string; //Stripe Price ID of the post
    product_id: string; //Stripe Product ID of the post
    product_subject: Array<string>; //Array of subject IDs, does not contain actual subject names
    post_grade: Array<string>; //Array of grade IDs, does not contain actual grade names
    resource_types: Array<string>; // Array of resocource types IDs, does not contain actual resource_types names
    listing_status: boolean; //Boolean of whether the post is listed or not

    //These fields are not stored in the database and must be fetched from stripe (price) or set by the code
    subject: Array<string> | null; //Array of subject names
    grade: Array<string> | null; //Array of grade names
    resourceTypes: Array<string> | null; //Array of resourceTypes names
    image_url: string | undefined; //Actual images for the post DOES NOT COME FROM DATABASE
    seller_img: string | undefined; //Profile Image of the seller
    price: number; //Price of the post
    quantity: number; //Quantity to add to cart from post
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
