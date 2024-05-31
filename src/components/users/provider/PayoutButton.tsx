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

const stripeId = stripeData![0].stripe_connected_account_id;

//Check if Stripe account has been set up, TODO: May want to check if we should change this to check for capabilities vs charges_enabled.
const stripeAcctSetup = await stripe.accounts.retrieve(stripeId).then((res) => {
    return res.payouts_enabled;
});

const balanceData = await stripe.balance.retrieve({
    stripeAccount: stripeId,
});

export const PayoutButton = () => {
    const [isUser, setIsUser] = createSignal<boolean | null>(false);
    const [payoutSetup, setPayoutSetup] =
        createSignal<boolean>(stripeAcctSetup);
    const [balance, setBalance] = createSignal<number>(0);

    if (
        balanceData.available[0].amount === null ||
        balanceData.available[0].amount === undefined
    ) {
        setBalance(0);
    } else {
        setBalance(balanceData.available[0].amount);
    }

    if (User.session === null) {
        //User is null
    } else {
        setIsUser(User.session!.user.role === "authenticated");
    }

    async function stripeSetup(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        const accountLink = await stripe.accountLinks.create({
            account: stripeId,
            refresh_url: SITE.url + "/creator/profile",
            return_url: SITE.url + "/creator/profile",
            type: "account_onboarding",
        });
        window.open(accountLink.url, "_blank");
    }

    async function requestPayout(e: Event) {
        e.preventDefault();
        e.stopPropagation();

        if (balance() <= 225) {
            alert(t("messages.insufficientStripeBalance"));
        } else if (balance() > 225) {
            const charge = await stripe.charges.create({
                amount: 225,
                currency: "usd",
                description: "Payout",
                source: stripeId,
            });
            const payout = await stripe.payouts.create(
                {
                    amount: balance() - 225,
                    currency: "usd",
                },
                {
                    stripeAccount: stripeId,
                }
            );

            alert(`${t("messages.payoutRequested")}: $ ${payout.amount / 100}`);
            console.log(payout);
        }
    }

    if (UserError) {
        console.log("User Error: " + UserError.message);
    }

    function renderWhenFalse() {
        if (payoutSetup() === false) {
            return (
                <div class="">
                    <div>
                        <p>{t("messages.payoutSetup")}</p>
                    </div>
                    <button
                        onclick={(e) => stripeSetup(e)}
                        class="btn-primary"
                        aria-label={t("buttons.finishStripeSetup")}
                    >
                        {t("buttons.finishStripeSetup")}
                    </button>
                </div>
            );
        }
    }

    function renderWhenTrue() {
        if (payoutSetup() === true) {
            return (
                <div class="">
                    <div class="mt-4">
                        <p>{t("messages.requestPayout")}</p>
                        <div class="mt-4 flex mb-6">
                            <span class="flex align-middle">
                                {t("messages.currentBalance")} $
                                {(balance() / 100).toFixed(2)}
                            </span>

                            <button
                                onclick={(e) => requestPayout(e)}
                                class="btn-primary md:ml-4 inline-block text-sm md:text-base"
                                aria-label={t("buttons.stripeLogin")}
                            >
                                {t("buttons.requestStripePayout")}
                            </button>
                        </div>
                    </div>
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
