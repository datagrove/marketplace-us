import { AuthMode } from "@components/common/AuthMode";
import { CreatePostsRouting } from "@components/posts/CreatePostsRouting";
import { UserRouting } from "@components/members/UserRouting";
import supabase from "@lib/supabaseClient";
import { Show, createSignal } from "solid-js";
import { getLangFromUrl, useTranslations } from "@i18n/utils";
import stripe from "@lib/stripe";
import { SITE } from "src/config";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

const { data: User, error: UserError } = await supabase.auth.getSession();
if (User.session === null) {
    console.log("User is null");
    alert(t("messages.signIn"));
    location.href = `/${lang}/login`;
}

const { data: stripeData, error: stripeError } = await supabase
    .from("sellers")
    .select("stripe_connected_account_id")
    .eq("user_id", User!.session!.user.id);

if (stripeError) {
    console.log("Stripe Error: " + stripeError.message);
}
if (!stripeData) {
    console.log("No Stripe ID found");
} else {
    console.log(stripeData);
}

// Improvement: This probably shouldn't be needed in the button like this the page should check that before loading the button at all. But this works for now.
if (stripeData === null || stripeData.length === 0) {
    alert(t("messages.noCreator"));
    location.href = `/${lang}/creator/createaccount`;
}
const stripeId = stripeData![0].stripe_connected_account_id;


//Check if Stripe account has been set up, TODO: May want to check if we should change this to check for capabilities vs charges_enabled.
const stripeAcctSetup = await stripe.accounts.retrieve(stripeId).then((res) => {
    return res.charges_enabled;
});

export const StripeButton = () => {
    const [isUser, setIsUser] = createSignal<boolean | null>(false);
    const [accountSetup, setAccountSetup] =
        createSignal<boolean>(stripeAcctSetup);

    if (User.session === null) {
        //User is null
    } else {
        setIsUser(User.session!.user.role === "authenticated");
    }

    async function stripeSetup(e:Event) {
        e.preventDefault()
        e.stopPropagation()

        const accountLink = await stripe.accountLinks.create({
            account: stripeId,
            refresh_url: SITE.url + "/creator/profile",
            return_url: SITE.url + "/creator/profile",
            type: "account_onboarding",
        });
        window.open(accountLink.url, "_blank");
    }

    async function stripeLogin(e:Event) {
        e.preventDefault()
        e.stopPropagation()

        const loginLink = await stripe.accounts.createLoginLink(stripeId);
        window.open(loginLink.url, "_blank");
    }

    if (UserError) {
        console.log("User Error: " + UserError.message);
    }

    function renderWhenFalse() {
        if (accountSetup() === false) {
            return (
                <div class="">
                    <button
                        onclick={(e) =>stripeSetup(e)}
                        class="mr-4 flex rounded-lg border border-border1 px-3 py-2 dark:border-border1-DM md:mr-0"
                        aria-label={t("buttons.stripeSetup")}
                    >
                        {t("buttons.stripeSetup")}
                    </button>
                </div>
            );
        }
    }

    function renderWhenTrue() {
        if (accountSetup() === true) {
            return (
                <div class="">
                    <button
                        onclick={(e) => stripeLogin(e)}
                        class="mr-4 flex rounded-lg border border-border1 px-3 py-2 dark:border-border1-DM md:mr-0"
                        aria-label={t("buttons.stripeLogin")}
                    >
                        {t("buttons.stripeLogin")}
                    </button>
                </div>
            );
        }
    }

    return (
        <div class="">
            {renderWhenFalse()}
            {renderWhenTrue()}
        </div>
    );
};
