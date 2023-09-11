import { Component, createSignal } from "solid-js";
import { supabase } from "./supabaseClient";
import { currentSession } from "./userSessionStore";
import { getLangFromUrl, useTranslations } from "../i18n/utils";

const lang = getLangFromUrl(new URL(window.location.href));
const t = useTranslations(lang);

export const Auth: Component = (props) => {
  // @ts-ignore
  const { mode = "sign_in" } = props;
  const [loading, setLoading] = createSignal(false);
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [confirmPassword, setConfirmPassword] = createSignal("");
  const [passwordMatch, setPasswordMatch] = createSignal(false);
  const match = () => password() === confirmPassword();
  const [authMode, setAuthMode] = createSignal<"sign_in" | "sign_up">(mode);
  const lang = getLangFromUrl(new URL(window.location.href));
  const t = useTranslations(lang);
  const regularExpressionPassword =
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{6,}$/;
  const regularExpressionEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const handleLogin = async (e: SubmitEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email(),
        password: password(),
      });
      if (error) throw error;
      currentSession.set(data.session);
      // const test = useStore(currentSession)
      // console.log("Current Session: " + test()?.user.aud)
      location.href = `/${lang}/services`;
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: SubmitEvent) => {
    e.preventDefault();

    if (
      regularExpressionPassword.test(password()) &&
      regularExpressionEmail.test(email())
    ) {
      if (password() === confirmPassword()) {
        setPasswordMatch(true);
        try {
          setLoading(true);
          const { data, error } = await supabase.auth.signUp({
            email: email(),
            password: password(),
          });
          if (error) throw error;
          alert(t("messages.checkConfirmEmail"));
          if (data && data.user) {
            if (
              data.user.identities &&
              data.user.identities.length > 0 &&
              data.session === null
            ) {
              const { error } = await supabase.auth.resend({
                type: "signup",
                email: email(),
              });
              if (error) console.log(error);
            }
          }
          location.href = `/${lang}`;
        } catch (error) {
          if (error instanceof Error) {
            alert(error.message);
          }
        } finally {
          setLoading(false);
        }
      } else {
        setPasswordMatch(false);
        alert(t("messages.passwordMatch"));
      }
    } else if (
      !regularExpressionEmail.test(password()) &&
      !regularExpressionPassword.test(email())
    ) {
      alert(t("messages.passwordLackRequirements"));
      alert(t("messages.emailLackRequirements"));
    } else if (!regularExpressionEmail.test(password())) {
      alert(t("messages.passwordLackRequirements"));
    } else if (!regularExpressionPassword.test(email())) {
      alert(t("messages.emailLackRequirements"));
    }
  };

  return (
    <div>
      {/* If the auth mode is sign in then return the sign in form */}
      {authMode() === "sign_in" ? (
        <div class="row flex-center flex">
          <div class="col-6 form-widget" aria-live="polite">
            <form class="form-widget" onSubmit={handleLogin}>
              <div class="mb-4 flex justify-center">
                <label class="hidden" for="email">
                  {t("formLabels.email")}
                </label>
                <input
                  id="email"
                  class="inputField ml-2 rounded-md pl-2 w-5/6 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                  type="email"
                  placeholder={t("formLabels.email")}
                  value={email()}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>
              <div class="mb-4 flex justify-center">
                <label class="hidden" for="password">
                  {t("formLabels.password")}
                </label>
                <input
                  id="password"
                  class="inputField ml-2 rounded-md pl-2 w-5/6 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                  type="password"
                  placeholder={t("formLabels.password")}
                  value={password()}
                  onChange={(e) => {
                    setPassword(e.currentTarget.value);
                    }
                  }
                />
              </div>
              <div class="mb-4 flex justify-center">
                <button type="submit" class="btn-primary" aria-live="polite">
                  {loading() ? (
                    <span>{t("buttons.loading")}</span>
                  ) : (
                    <span>{t("buttons.login")}</span>
                  )}
                </button>
              </div>
              <div>
                <p class="text-sm text-ptext1 dark:text-ptext1-DM">
                  {" "}
                  {t("messages.noAccount")}
                  <a
                    class="text-link1 hover:underline dark:text-link1-DM"
                    href={`/${lang}/signup`}
                  >
                    {t("buttons.signUp")}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : //Else if the auth mode is sign up then return the sign up form
      authMode() === "sign_up" ? (
        <div class="row flex-center flex">
          <div class="col-6 form-widget" aria-live="polite">
            <form class="form-widget" onSubmit={handleSignUp}>
              <div class="mb-4 flex justify-center">
                <label class="hidden" for="email">
                  {t("formLabels.email")}
                </label>
                <input
                  id="email"
                  class="inputField ml-2 rounded-md pl-2 w-5/6 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                  type="email"
                  placeholder={t("formLabels.email")}
                  required
                  value={email()}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                />
              </div>

              <div class="mb-1 flex justify-center">
                <label for="password" class="hidden">
                  {t("formLabels.password")}
                </label>
                <input
                  id="password"
                  class="inputField ml-2 rounded-md pl-2 w-5/6 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                  type="password"
                  placeholder={t("formLabels.password")}
                  required
                  value={password()}
                  oninput={(e) => setPassword(e.currentTarget.value)}
                  aria-describedby="pwlength"
                />
              </div>
              <div class="mb-4 flex justify-center">
                {regularExpressionPassword.test(password()) ? (
                  <span
                    id="pwlength"
                    class="text-sm text-ptext1 dark:text-ptext1-DM "
                  >
                    {t("messages.passwordValid")}
                  </span>
                ) : (
                  <span
                    id="pwlength"
                    class="text-sm text-ptext1 dark:text-ptext1-DM whitespace-pre-wrap"
                  >
                    {t("messages.passwordLength")}
                  </span>
                )}
              </div>
              <div class="mb-1 flex justify-center">
                <label for="confirm password" class="hidden">
                  {t("formLabels.confirmPassword")}
                </label>
                <input
                  id="confirm password"
                  class="inputField ml-2 rounded-md pl-2 w-5/6 focus:border-highlight1 dark:focus:border-highlight1-DM border focus:border-2 border-inputBorder1 dark:border-inputBorder1-DM focus:outline-none bg-background1 dark:bg-background2-DM text-ptext1 dark:text-ptext2-DM"
                  type="password"
                  placeholder={t("formLabels.confirmPassword")}
                  required
                  value={confirmPassword()}
                  oninput={(e) => setConfirmPassword(e.currentTarget.value)}
                  aria-describedby="pwconfirm"
                />
              </div>
              <div class="mb-4 flex justify-center">
                {match() ? (
                  ""
                ) : (
                  <span
                    id="pwconfirm"
                    class="text-sm font-bold text-alert1 dark:text-alert1-DM"
                  >
                    {t("messages.passwordMatch")}
                  </span>
                )}
              </div>
              <div class="px-10">
                {t("messages.clickWrap1")}{" "}
                <span class="font-medium">{t("pageTitles.signUp")}</span>{" "}
                {t("messages.clickWrap2")}{" "}
                <a href={`/${lang}/terms`} target="_blank" class="text-link2-DM hover:underline">
                  {t("pageTitles.terms")}
                </a>{" "}
                &{" "}
                <a href={`/${lang}/privacy`} target="_blank" class="text-link2-DM hover:underline">
                  {t("pageTitles.privacy")}
                </a>
              </div>
              <div class="mb-4 flex justify-center">
                <button
                  type="submit"
                  class="mt-4 btn-primary"
                  aria-live="polite"
                  disabled={!match()}
                >
                  {loading() ? (
                    <span>{t("buttons.loading")}</span>
                  ) : (
                    <span>{t("pageTitles.signUp")}</span>
                  )}
                </button>
              </div>

              <div class="my-2">
                <p class="text-ptext1 dark:text-ptext1-DM">
                  {t("messages.alreadyAccount")}
                  <span> </span>
                  <a
                    class="text-link2 hover:underline dark:text-link2-DM"
                    href={`/${lang}/login`}
                  >
                    {t("buttons.signIn")}
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Else return an error if it is neither auth mode
        "Error"
      )}
    </div>
  );
};
