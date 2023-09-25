import {
  Component,
  Suspense,
  createEffect,
  createResource,
  createSignal,
} from "solid-js";
import intlTelInput from "intl-tel-input";
import "intl-tel-input/build/css/intlTelInput.css";
import { utils } from "intl-tel-input";

export const PhoneInput: Component = () => {
  const phoneInput = document.getElementById("Phone");
  const iti = intlTelInput(phoneInput!, {
    initialCountry: "cr",
    utilsScript: utils,
    separateDialCode: true,
    autoInsertDialCode: true,
    autoPlaceholder: "aggressive",
    placeholderNumberType: "MOBILE",
    preferredCountries: ["cr", "us", "ni", "co"],
  });

  return null;
};
