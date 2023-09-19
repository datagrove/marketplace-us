import { Component, JSX, createSignal, Show, createEffect, onCleanup } from 'solid-js';

type ModalProps = {
    children: JSX.Element;
    heading: string;
}

let modalOverlay = document.getElementById("modal-overlay");

const SocialModal: Component<ModalProps> = function(props) {
    const [isOpen, setIsOpen] = createSignal(false);
    const elements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    let modal: HTMLElement;

    function openModal(e:any) {
        console.log("e: ", e)

        if(modalOverlay?.classList.contains("hidden")) {
            modalOverlay.classList.remove("hidden");
            modalOverlay.classList.add("block");
        }
        // e.stopPropagation();
        alert("Open Modal Clicked")
        setTimeout(() => {
            setIsOpen(true);
        }, 5000);    
    }

    createEffect(() => {
        console.log("isOpen: ", isOpen())
        if(isOpen()) {
            const originalElement = document.activeElement as HTMLElement;
            console.log("original element: ", originalElement)
            const modalElements = modal.querySelectorAll(elements);
            const firstElement = modalElements?.[0] as HTMLElement;
            const lastElement = modalElements?.[modalElements.length -1] as HTMLElement;

            const focusTrap = function(e: KeyboardEvent) {
                const { key, code, shiftKey} = e;
                const isTabPressed = ( key || code ) === 'Tab';
                const isEscapePressed = ( key || code ) === 'Escape';

                if(!isTabPressed && !isEscapePressed) return;
                if(isEscapePressed) return setIsOpen(false);
                if(shiftKey) {
                    if(document.activeElement === firstElement) {
                        lastElement?.focus();
                        e.preventDefault();
                    } 
                } else if(document.activeElement === lastElement) {
                    firstElement?.focus();
                    e.preventDefault();
                }
            };
            firstElement?.focus();
            document.addEventListener('keydown', focusTrap);
            onCleanup(() => {
                document.removeEventListener('keydown', focusTrap);
                originalElement.focus();
            });
        }
    });
    
    return (
        <div class="border-2 border-green-200 fixed w-4/5 h-2/5 right-4 flex flex-col">
            <button class="border-4 border-purple-300 rounded px-2 flex justify-end" type="button" onClick={ (e) => openModal(e) }>
                <svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-share-2" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"></path>
                    <path d="M12 14v-11"></path>
                    <path d="M9 6l3 -3l3 3"></path>
                </svg>
            </button>

            <div id="modal-overlay" class="overlay w-full h-5/6 bg-gray-700 opacity-90 ">
                <div class="bg-blue-300">
                    {/* <button type="button" onClick={() => setIsOpen(true)}> */}

                        <Show
                            when={ isOpen()}
                            // fallback={ <button onClick={() => setIsOpen(true)}>Open Modal</button> }
                        >
                            <div
                                role="presentation"
                                class="bg-yellow-200"
                                onClick={() => setIsOpen(false)}
                                onKeyPress={(e) => (e.key || e.code) === 'Esacpe' ? setIsOpen(false) : null }
                            />
                            <section role="dialog" class="modal">
                                <header class="flex justify-between">
                                    <h2>{ props.heading }</h2>
                                    <button
                                        aria-aria-label='Close Dialog'
                                        class="modal-close border-4 border-orange-400"
                                        onClick={() => console.log('Modal should close')}
                                    >
                                        &times;
                                    </button>
                                </header>
                                <div class="modal-body">{ props.children }</div>
                            </section>
                        </Show>
                </div>
            </div>
        </div>
    )
}

export default SocialModal;