import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, Show } from "solid-js";
import { getHeading } from "./utils";
import type { HeadingProps } from "./utils";

type ModalProps = {
    children: JSX.Element;
    buttonClass: string;
    buttonId: string;
    buttonContent: JSX.Element;
    heading: HeadingProps["heading"];
    headingLevel?: HeadingProps["headingLevel"];
};

const Modal: Component<ModalProps> = (props) => {
    const [isOpen, setIsOpen] = createSignal<boolean>(false);
    const [modal, setModal] = createSignal<HTMLElement | null>(null);

    const focusableElements =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    createEffect(() => {
        if (isOpen()) {
            console.log("modal open");
            const originalFocusedElement =
                document.activeElement as HTMLElement;
            const modalFocusableElements =
                modal()?.querySelectorAll(focusableElements);
            const firstFocusableElement =
                modalFocusableElements?.[0] as HTMLElement;
            const lastFocusableElement = modalFocusableElements?.[
                modalFocusableElements.length - 1
            ] as HTMLElement;
            const focusTrap = function (e: KeyboardEvent) {
                const { key, code, shiftKey } = e;
                const isTabPressed = (key || code) === "Tab";
                const isEscapePressed = (key || code) === "Escape";
                if (!isTabPressed && !isEscapePressed) return;
                if (isEscapePressed) return setIsOpen(false);
                if (shiftKey) {
                    // if shift key pressed for shift + tab combination
                    if (document.activeElement === firstFocusableElement) {
                        lastFocusableElement?.focus(); // add focus for the last focusable element
                        e.preventDefault();
                    }
                    // if tab key is pressed
                } else if (document.activeElement === lastFocusableElement) {
                    // if focused has reached to last focusable element then focus first focusable element after pressing tab
                    firstFocusableElement?.focus(); // add focus for the first focusable element
                    e.preventDefault();
                }
            };
            firstFocusableElement?.focus();
            document.addEventListener("keydown", focusTrap);
            onCleanup(() => {
                document.removeEventListener("keydown", focusTrap);
                originalFocusedElement?.focus();
            });
        }
    });

    function openModal (e: Event) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(true);
    }

    function closeModal (e: Event) {
        e.preventDefault();
        e.stopPropagation();
        setIsOpen(false);
    }
    return (
        <>
            <button
                class={props.buttonClass}
                id={props.buttonId}
                type="button"
                onClick={(e) => openModal(e)}
            >
                {props.buttonContent}
            </button>
            <Show when={isOpen()}>
                <div
                    role="presentation"
                    class="modal__backdrop min-h-100vh min-w-100vw fixed inset-0  z-[55] dark:bg-background1 bg-background1-DM bg-opacity-50 dark:bg-opacity-30"
                    onClick={(e) => closeModal(e)}
                    onKeyPress={(e) =>
                        (e.key || e.code) === "Escape" ? closeModal(e) : null
                    }
                />
                <section
                    role="dialog"
                    class="modal p-4 min-h-100vh w-100vw fixed inset-0 z-[60] overflow-y-auto dark:bg-background1-DM bg-background1 md:-translate-x-1/2 md:-translate-y-1/2 md:left-1/2 md:top-1/2 md:max-h-[calc(100vh-4rem)] md:min-h-fit md:w-[calc(100vw-4rem)] md:max-w-[768px] md:rounded-xl"
                    ref={setModal}
                >
                    <header class="flex flex-row flex-nowrap border-b-[1px] gap-[2rem] justify-between sticky items-center">
                        {getHeading({
                            heading: props.heading,
                            headingLevel: props?.headingLevel,
                        })}
                        <button
                            aria-label="Close Dialog"
                            class="modal__close text-xl"
                            onClick={(e) => closeModal(e)}
                        >
                            &times;
                        </button>
                    </header>
                    <div class="modal__body pt-2">{props.children}</div>
                </section>
            </Show>
        </>
    );
};

export default Modal;
