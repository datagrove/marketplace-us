import {
  Component,
  Suspense,
  createEffect,
  createResource,
  createSignal,
  onMount,
  onCleanup,
} from "solid-js";
import "intl-tel-input/build/css/intlTelInput.css"; // Import the CSS for styling
import intlTelInput from "intl-tel-input";



function TelephoneInput() {
  const [telephoneValue, setTelephoneValue] = createSignal("");
  let inputRef: any;

  onMount(() => {
    const inputElement = inputRef;
    console.log(inputElement);
    if (inputElement) {
      // Wrap intlTelInput initialization in a Promise
      const telInputPromise = new Promise((resolve) => {
        intlTelInput(inputElement, {
          initialCountry: "us",
          separateDialCode: false,
          utilsScript: "/intl-tel-input/build/js/utils.js", // Make sure to provide the correct path to utils.js
        }),
          () => {
            resolve(intlTelInputGlobals.getInstance(inputElement)); // Resolve with the initialized instance
          };
      });

      telInputPromise.then((telInput) => {
        console.log("Instance: " + telInput);

        // Event listener to update the signal when the input value changes
        inputElement.addEventListener("input", () => {
          console.log("TelInput: " + telInput.getNumber());
          console.log("Input Value: " + inputElement.value);
          setTelephoneValue(telInput.getNumber());
        });

        onCleanup(() => {
          telInput.destroy();
          inputElement.removeEventListener();
        });
      });

      // Cleanup function when the component is unmounted
      
    }
  });

  return (
    <div>
      <input
        ref={inputRef}
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
