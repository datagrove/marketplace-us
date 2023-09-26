import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import "intl-tel-input/build/css/intlTelInput.css"; // Import the CSS for styling
import intlTelInput from "intl-tel-input";

interface Props {
  onInput: (event: any) => void;
}

export const TelephoneInput: Component<Props> = (props) => {
  const [telephoneValue, setTelephoneValue] = createSignal("");
  let inputRef: HTMLInputElement | null = null;
  let telInput: any = null;

  onMount(() => {
    const inputElement = inputRef;

    if (inputElement) {
      telInput = intlTelInput(inputElement, {
        initialCountry: "cr",
        separateDialCode: true,
        autoInsertDialCode: true,
        autoPlaceholder: "aggressive",
        placeholderNumberType: "MOBILE",
        preferredCountries: ["cr", "us", "ni", "co"],
        utilsScript: "/intl-tel-input/build/js/utils.js", // Make sure to provide the correct path to utils.js
      });

      // Event listener to update the signal when the input value changes
      const inputHandler = () => {
        if (inputElement.value.trim()) {

          if (telInput.isPossibleNumber()) {
            if (typeof props.onInput === "function") {
              props.onInput(telInput.getNumber().substring(1));
            }
          } else {
            if (typeof props.onInput === "function") {
              props.onInput("");
              //TODO: Add a registration form error (highlight field red on change)
            }
          }
        }

      };

      inputElement.addEventListener("input", inputHandler);

      onCleanup(() => {
        if (telInput) {
          telInput.destroy();
        }
        inputElement.removeEventListener("input", inputHandler);
      });
    }
  });

  return (
    <div>
      <input
        ref={(el) => (inputRef = el)}
        type="tel"
        id="telephoneInput"
        class="rounded w-full mb-4 px-1 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
      />
    </div>
  );
};

export default TelephoneInput;
