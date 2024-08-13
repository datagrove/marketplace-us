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
    function formatContent(e: Event) {
        e.preventDefault();

        const postInfo = document.getElementById(
            "postInfo"
        ) as HTMLInputElement;
        const postInfoValue = postInfo.value.trim();

        const issue = document.getElementById("issue") as HTMLInputElement;
        const issueValue = issue.value.trim();

        const formattedContent = `${postInfoValue}\n\nIssue:\n${issueValue}`;

        const mailtoLink = `mailto:support@learngrove.co?subject=Report Resource&body=${encodeURIComponent(formattedContent)}`;

        window.location.href = mailtoLink;
    }

    return (
        <>
            <Modal
                buttonClass=""
                buttonContent={
                    <div>
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            class="mr-1 inline-block h-4 w-4 text-alert1 dark:text-alert1-DM"
                        >
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
                    <form
                        method="post"
                        action="mailto:support@learngrove.co"
                        enctype="multipart/form-data"
                        class="flex flex-col"
                        onSubmit={(e) => {
                            formatContent(e);
                        }}
                    >
                        <textarea
                            name="Post Information"
                            id="postInfo"
                            readonly
                            class="h-24 flex-wrap rounded-lg border bg-gray-300 text-black md:h-20"
                            value={`Post Id: ${props.post.id} 
Post Title: ${props.post.title}
Reporting Id: ${props.user_id}`}
                        />
                        <label class="sr-only" for="Issue">
                            Please describe the issue with this resource
                        </label>
                        <textarea
                            id="issue"
                            name="Issue"
                            rows="5"
                            placeholder={t("messages.pleaseDescribe")}
                            class="mb-4 mt-2 block w-full rounded-lg border border-border1 px-1 text-black placeholder:italic placeholder:text-black"
                        />
                        <label
                            class=""
                            innerHTML={t("messages.reportResource")}
                        ></label>
                        <div class="my-2 flex justify-end">
                            <input
                                type="submit"
                                value="Submit"
                                class="btn-primary"
                            />
                        </div>
                    </form>
                }
            ></Modal>
        </>
    );
};
