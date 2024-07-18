import type { Component, JSX } from "solid-js";
import { createSignal, createEffect, onCleanup, Show } from "solid-js";
import { getHeading } from "./utils";
import type { HeadingProps } from "./utils";

type ModalProps = {
    children: JSX.Element;
    heading: HeadingProps["heading"];
    headingLevel?: HeadingProps["headingLevel"];
};

const Modal: Component<ModalProps> = (props) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const [modal, setModal] = createSignal<HTMLElement | null>(null);

    const focusableElements =
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';


    createEffect(() => {
        if (isOpen()) {
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

    return (
        <>
            <button type="button" onClick={() => setIsOpen(true)}>
                Open Modal
            </button>
            <Show when={isOpen()}>
                <div
                    role="presentation"
                    class="modal__backdrop"
                    onClick={() => setIsOpen(false)}
                    onKeyPress={(e) =>
                        (e.key || e.code) === "Escape" ? setIsOpen(false) : null
                    }
                />
                <section role="dialog" class="modal" ref={setModal}>
                    <header>
                        {getHeading({
                            heading: props.heading,
                            headingLevel: props?.headingLevel,
                        })}
                        <button
                            aria-label="Close Dialog"
                            class="modal__close"
                            onClick={() => setIsOpen(false)}
                        >
                            &times;
                        </button>
                    </header>
                    <div class="modal__body">{props.children}</div>
                </section>
            </Show>
        </>
    );
};

export default Modal;
