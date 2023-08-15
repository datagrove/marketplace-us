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
      location.href = `/${lang}`;
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

    if (password() === confirmPassword()) {
      setPasswordMatch(true);
      try {
        setLoading(true);
        const { error } = await supabase.auth.signUp({
          email: email(),
          password: password(),
        });
        if (error) throw error;
        alert(t("messages.checkConfirmEmail"));
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
                  class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border"
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
                  class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border"
                  type="password"
                  placeholder={t("formLabels.password")}
                  value={password()}
                  onChange={(e) => {
                    if (e.currentTarget.value.length > 5) {
                      console.log("Password length is greater than 5");
                      return setPassword(e.currentTarget.value);
                    }
                  }}
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
                <p class="text-sm text-text1 dark:text-text1-DM">
                  {" "}
                  {t("messages.noAccount")}
                  <a
                    class="text-link2 hover:underline dark:text-link2-DM"
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
                  class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border"
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
                  class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border"
                  type="password"
                  placeholder={t("formLabels.password")}
                  required
                  value={password()}
                  oninput={(e) => setPassword(e.currentTarget.value)}
                  aria-describedby="pwlength"
                />
              </div>
              <div class="mb-4 flex justify-center">
                {password().length > 5 ? (
                  ""
                ) : (
                  <span
                    id="pwlength"
                    class="text-sm text-text1 dark:text-text1-DM"
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
                  class="inputField ml-2 rounded-md pl-2 w-5/6 border border-border"
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
                    class="text-sm text-text1 dark:text-text1-DM"
                  >
                    {t("messages.passwordMatch")}
                  </span>
                )}
              </div>
              <div class="mb-4 flex justify-center">
                <button
                  type="submit"
                  class="mt-3 btn-primary dark:bg-btn1-DM"
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
                <p class="text-text1 dark:text-text1-DM">
                  {t("messages.alreadyAccount")}
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
