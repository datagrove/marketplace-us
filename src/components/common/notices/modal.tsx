import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, Show } from "solid-js";
import { getHeading } from "./utils";
import type { HeadingProps } from "./utils";
import { createStore } from "solid-js/store";
import { Portal } from "solid-js/web";

type ModalProps = {
    children: JSX.Element;
    buttonClass: string;
    buttonId: string;
    buttonContent: JSX.Element;
    buttonAriaLabel?: string;
    heading: HeadingProps["heading"];
    headingLevel?: HeadingProps["headingLevel"];
    //classList?: string;
};

export const [isOpen, setIsOpen] = createSignal<Record<string, boolean>>({});

export function openModal(modalId: string, e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    setIsOpen((prev) => ({ ...prev, [modalId]: true }));
}

export function closeModal(modalId: string, e?: Event) {
    e?.preventDefault();
    e?.stopPropagation();
    setIsOpen((prev) => ({ ...prev, [modalId]: false }));
}

export function isModalOpen(modalId: string) {
    return isOpen()[modalId];
}

const Modal: Component<ModalProps> = (props) => {
    const [modal, setModal] = createSignal<HTMLElement | null>(null);

    const focusableElements =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    createEffect(() => {
        if (isModalOpen(props.buttonId)) {
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
                if (isEscapePressed) return closeModal(props.buttonId, e);
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

    // function openModal(e: Event) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     setIsOpen(true);
    // }

    // function closeModal(e: Event) {
    //     e.preventDefault();
    //     e.stopPropagation();
    //     setIsOpen(false);
    // }

    return (
        <>
            <button
                class={props.buttonClass}
                id={props.buttonId}
                aria-label={props.buttonAriaLabel}
                type="button"
                onClick={(e) => openModal(props.buttonId, e)}
            >
                {props.buttonContent}
            </button>
            <Show when={isModalOpen(props.buttonId)}>
                <Portal>
                    <div
                        role="presentation"
                        class="modal__backdrop min-h-100vh min-w-100vw fixed inset-0  z-[55] bg-background1-DM bg-opacity-50 dark:bg-background1 dark:bg-opacity-30"
                        onClick={(e) => closeModal(props.buttonId, e)}
                        onKeyPress={(e) =>
                            (e.key || e.code) === "Escape"
                                ? closeModal(props.buttonId, e)
                                : null
                        }
                    />
                    <section
                        role="dialog"
                        class="modal min-h-100vh w-100vw md:min-h-auto fixed inset-0 z-[60] overflow-y-auto bg-background1 p-4 dark:bg-background1-DM md:left-1/2 md:top-1/2 md:max-h-[calc(100vh-4rem)] md:w-[calc(100vw-4rem)] md:max-w-[768px] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl"
                        ref={setModal}
                    >
                        <header class="sticky flex flex-row flex-nowrap items-center justify-between gap-[2rem] border-b-[1px]">
                            {getHeading({
                                heading: props.heading,
                                headingLevel: props?.headingLevel,
                            })}
                            <button
                                aria-label="Close Dialog"
                                class="modal__close text-xl"
                                onClick={(e) => closeModal(props.buttonId, e)}
                            >
                                &times;
                            </button>
                        </header>
                        <div class="modal__body pt-2">{props.children}</div>
                    </section>
                </Portal>
            </Show>
        </>
    );
};

export default Modal;
