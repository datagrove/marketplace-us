import { getLangFromUrl, useTranslations } from "@i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);
export const DownloadBtn = () => {
    return (
        <button aria-label={t("buttons.addToCart")} class="btn-cart">
            {t("buttons.download")}
        </button>
    );
};
