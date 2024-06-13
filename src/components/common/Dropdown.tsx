import { createSignal, Show } from "solid-js";
import type { Component } from "solid-js";
import { getLangFromUrl, useTranslations } from "../../i18n/utils";

// Internationalization
const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

//TODO: Upgrade to have an option for required and not let a user select nothing
interface Props {
    options: HTMLOptionElement[];
    selectedOption: HTMLOptionElement;
    setSelectedOption: (option: HTMLOptionElement) => void;
}

const Dropdown: Component<Props> = (Props: Props) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const [hasSelectedOption, setHasSelectedOption] = createSignal(false);

    function handleOptionClick(option: HTMLOptionElement) {
        Props.setSelectedOption(option);
        setHasSelectedOption(true);
        setIsOpen(false);
    }

    return (
        <div class="relative inline-block w-full">
            {/* Dropdown button */}
            <button
                class="w-full flex rounded justify-between border border-inputBorder1 bg-background1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(!isOpen());
                }}
            >
                <div class="ml-1 inline-block">
                    {Props.selectedOption || t("formLabels.chooseTaxCode") || t("formLabels.dropdownDefault")}
                </div>
                {/* Dropdown icon */}
                <div class="inline-block">
                    <svg
                        class={`inline-block h-5 w-5 transform transition-transform dark:fill-white 
                        ${isOpen() ? "rotate-180" : ""}`}
                    >
                        <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"
                        />
                    </svg>
                </div>
            </button>
            {isOpen() && (
                <div
                    class="mb-4 max-h-96 max-w-fit overflow-auto whitespace-normal rounded bg-background1 text-ptext1 focus:border-2 focus:border-highlight1 focus:outline-none dark:border-inputBorder1-DM dark:bg-background2-DM dark:text-ptext2-DM dark:focus:border-highlight1-DM"
                >
                    {Props.options.map((option) => (
                        <div
                            class="cursor-pointer whitespace-normal px-4 py-2 hover:bg-background1 dark:hover:bg-background1-DM"
                            onClick={(e) => {
                                e.preventDefault();
                                handleOptionClick(option);
                            }}
                        >
                            {option.text}
                            <div class="rounded border border-border1 p-2 text-xs dark:border-border1-DM">
                                {option.dataset.description}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Dropdown;
