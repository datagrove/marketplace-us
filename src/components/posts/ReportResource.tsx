import type { Component } from "solid-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";
import type { Post } from "@lib/types";
import Modal from "@components/common/notices/modal";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

interface Props {
    post: Post;
    user_id: string;
}

export const ReportResource: Component<Props> = (props) => {
    return (
        <>
            <Modal
                buttonClass="text-alert1 dark:text-alert1-DM"
                buttonContent={
                    <div>
                        <svg viewBox="0 0 24 24" fill="none" class="w-4 h-4 mr-1 inline-block">
                            <path
                                d="M4 15C4 15 5 14 8 14C11 14 13 16 16 16C19 16 20 15 20 15V4C20 4 19 5 16 5C13 5 11 3 8 3C5 3 4 4 4 4M4 22L4 2"
                                stroke="currentColor"
                                stroke-width="2"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                            </svg>
                        {t("buttons.reportResource")}
                        
                    </div>
                }
                buttonId={t("buttons.reportResource")}
                heading={t("buttons.reportResource")}
                children={
                    <form method="post" action="mailto:support@learngrove.co" enctype="text/plain" class="flex flex-col">
                        <textarea
                            name="Post Information"
                            disabled
                            class= "h-20 flex-wrap"
                            value={`Post Id: ${props.post.id} 
Post Title: ${props.post.title}
Reporting Id: ${props.user_id}`}
                        />
                        <label class="sr-only" for="Issue">Please describe the issue with this resource</label>
                        <textarea
                            name="Issue"
                            rows="10"
                            placeholder={
                                "Please Describe the issue with this resource"
                            }
                            class="w-full block rounded-lg mt-2 mb-4 text-black"
                        />
                        <label class="" innerHTML={t("messages.reportResource")}></label>
                        <div class="flex justify-end my-2">
                        <input type="submit" value="Submit" class="btn-primary" />
                        </div>
                    </form>
                }
            ></Modal>
        </>
    );
};
