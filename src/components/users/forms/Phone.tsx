import {
  Component,
  createEffect,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import "intl-tel-input/build/css/intlTelInput.css"; // Import the CSS for styling
import intlTelInput from "intl-tel-input";

function TelephoneInput() {
  const [telephoneValue, setTelephoneValue] = createSignal("");
  let inputRef: HTMLInputElement | null = null;
  let telInput: any = null;

  onMount(() => {
    const inputElement = inputRef;

    if (inputElement) {
      telInput = intlTelInput(inputElement, {
        initialCountry: "us",
        separateDialCode: false,
        utilsScript: "/intl-tel-input/build/js/utils.js", // Make sure to provide the correct path to utils.js
      });

      // Event listener to update the signal when the input value changes
      const inputHandler = () => {
        setTelephoneValue(telInput.getNumber());
        console.log(telInput.isPossibleNumber());
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
        placeholder="Enter phone number"
      />
      <div>
        <p>Selected phone number: {telephoneValue()}</p>
      </div>
    </div>
  );
}

export default TelephoneInput;
