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
  //this needs to be here or else the box won't render full width
  let iti: any;

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

      const changeHandler = () => {
        if (inputElement.value.trim()) {
          if (telInput.isPossibleNumber()) {
            if (typeof props.onInput === "function") {
              props.onInput(telInput.getNumber().substring(1));
              document.getElementById("notValidNumber")?.classList.add("hidden");
              document.getElementById("validNumber")?.classList.remove("hidden")
              document.getElementById("telephoneInput")?.classList.add("border-inputBorder1", "border", "dark:border-inputBorder1-DM");
              document.getElementById("telephoneInput")?.classList.remove("border-2", "border-alert1", "dark:border-alert1-DM");
            }
          } else {
            if (typeof props.onInput === "function") {
              props.onInput("");
              document.getElementById("validNumber")?.classList.add("hidden")
              document.getElementById("notValidNumber")?.classList.remove("hidden");
              document.getElementById("telephoneInput")?.classList.remove("border-inputBorder1", "border", "dark:border-inputBorder1-DM");
              document.getElementById("telephoneInput")?.classList.add("border-2", "border-alert1", "dark:border-alert1-DM");
              
            }
          }
        }
      };

      // inputElement.addEventListener("input", inputHandler);
      inputElement.addEventListener("change", changeHandler);

      onCleanup(() => {
        if (telInput) {
          telInput.destroy();
        }
        // inputElement.removeEventListener("input", inputHandler);
        inputElement.addEventListener("change", changeHandler);
      });
    }
  });

  return (
    <div class="flex justify-end items-center relative mb-4">
      <input
        ref={(el) => (inputRef = el)}
        type="tel"
        id="telephoneInput"
        class="peer rounded w-full mb-4 px-1 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
        required
      />
      <svg
        id="notValidNumber"
        viewBox="-3.5 0 19 19"
        xmlns="http://www.w3.org/2000/svg"
        class="w-4 h-4 fill-alert1 dark:fill-alert1-DM absolute mr-2 hidden"
      >
        <path d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z" />
      </svg>
      <svg
        id="validNumber"
        class="w-4 h-4 fill-btn1 dark:fill-btn1-DM absolute mr-2 hidden"
        viewBox="0 0 12 12"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="m4.94960124 7.88894106-1.91927115-1.91927115c-.29289322-.29289321-.76776696-.29289321-1.06066018 0-.29289321.29289322-.29289321.76776696 0 1.06066018l2.5 2.5c.31185072.31185071.82415968.28861186 1.10649605-.05019179l5.00000004-6c.265173-.31820767.22218-.7911312-.0960277-1.05630426s-.7911312-.22218001-1.05630426.09602766z" />
      </svg>
    </div>
  );
};

export default TelephoneInput;