"use client";

import React, { useEffect, useRef, useState } from "react";
import Input from "./ui/Input";
import { Button } from "./ui/button";
import { FcGoogle } from "react-icons/fc";
import { BellDot, ChevronRight, Info, Loader2 } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { validateUserEmail } from "@/controllers/auth/validateUser";
import { AnimatePresence, motion } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import Turnstile, { useTurnstile } from "react-turnstile";
import { forgetPassword } from "@/controllers/auth/forgetpassword";
import { validateEmailFormat } from "@/lib/mail";
import { useQueryParams } from "@/lib/useQueryParams";
import { Separator } from "./ui/separator";
import { createUser } from "@/controllers/auth/createuser";

function GetStarted() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const screenParam = searchParams.get("auth");
  const callback = searchParams.get("callback");

  const [screen, setScreen] = useState(null);
  const [loader, setloader] = useState(false);
  const [captchaToken, setcaptchaToken] = useState(null);
  const turnstile = useTurnstile();
  const { deleteQuery } = useQueryParams();

  const [emailOk, setemailOk] = useState(null);
  const [password, setpassword] = useState({ value: "", error: null });
  const [email, setEmail] = useState("");
  const debounceTimer = useRef(null);

  useEffect(() => {
    if (["signin", "signup", "forget"].includes(screenParam)) {
      setScreen(screenParam);
      setEmail("");
      setemailOk(null);
    }
  }, [screenParam]);

  const handleEmailChange = async (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setemailOk(null);
      return;
    }

    debounceCheck(value);
  };

  const debounceCheck = (value) => {
    if (!screen) return;

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    debounceTimer.current = setTimeout(async () => {
      const validFormat = validateEmailFormat(value);
      const isEmailExist = await validateUserEmail(value);

      if (!validFormat)
        return setemailOk({
          email: null,
          error: "Gmail, Yahoo, iCloud, and Outlook emails ",
        });

      if (screen === "signup") {
        if (isEmailExist) {
          setemailOk({ email: null, error: "This user already exist" });
          return;
        } else {
          return setemailOk({ email: value, error: null });
        }
      } else {
        if (!isEmailExist) {
          return setemailOk({ email: null, error: "This user not exist" });
        }
      }

      setemailOk({ email: value, error: null });
    }, 500);
  };

  const signInUser = async () => {
    if (!captchaToken) {
      enqueueSnackbar({
        message: "Verify Captcha",
        action: <Info strokeWidth={2} className="mr-2" size={20} />,
      });
      return;
    }

    if (screen === "signup") {
      registerUser();
      return;
    }

    if (!emailOk?.email) {
      debounceCheck(email);
      return;
    }

    if (screen === "forget") {
      forgetUser();
      return;
    }

    setloader(true);

    if (password?.length > 1) {
      setpassword({ value: null, error: "Invalid password" });
      return;
    }

    const res = await signIn("credentials", {
      email: emailOk.email,
      password: password.value,
      redirect: false,
    });

    setloader(false);

    if (res?.error) {
      enqueueSnackbar({
        message: "Incorrect password",
        action: <Info strokeWidth={2} className="mr-2" size={20} />,
      });
      return;
    }
    deleteQuery("account");
    if (callback) router.push(callback);
    else window.location.reload();
    setemailOk(null);
    setEmail(null);
    turnstile.reset();
  };

  const registerUser = async () => {
    setloader(true);
    const res = await createUser(emailOk?.email, captchaToken);
    setloader(false);

    if (res?.error) {
      enqueueSnackbar({
        message: res.error,
        action: <Info strokeWidth={2} className="mr-2" size={20} />,
      });
      return;
    }

    enqueueSnackbar({
      message: res.msg,
      action: <Info strokeWidth={2} className="mr-2" size={20} />,
    });

    turnstile.reset();
    setemailOk(null);
    setEmail("");
  };

  const forgetUser = async () => {
    setloader(true);
    const res = await forgetPassword(captchaToken, emailOk?.email);
    setloader(false);

    if (res?.error) {
      enqueueSnackbar({
        message: res.error,
        action: <Info strokeWidth={2} className="mr-2" size={20} />,
      });
      return;
    }

    enqueueSnackbar({
      message: res.msg,
      action: <BellDot strokeWidth={2} className="mr-2" size={20} />,
    });

    turnstile.reset();
    setemailOk(null);
    setEmail("");
  };

  if (!screen) return null;

  return (
    <section
      onClick={() => {
        deleteQuery("auth");
        setScreen(null);
      }}
      className="flex justify-center w-full items-center backdrop-blur-[8px] bg-black/20 h-screen fixed top-0 px-5 z-[99]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white max-w-[450px] flex flex-col gap-7 p-7 w-full rounded-md"
      >
        <div className="flex items-center w-full justify-between">
          <h2 className="text-2xl font-semibold">
            {screen === "signin"
              ? "Signin"
              : screen === "forget"
                ? "Forget Password"
                : "Signup"}
          </h2>

          {screen !== "forget" && (
            <Link
              href={screen !== "signin" ? "/?auth=signin" : "/?auth=signup"}
              className="text-black/50 font-medium underline underline-offset-4 decoration-2"
            >
              {screen !== "signin"
                ? "I have an account"
                : "I don’t have an account"}
            </Link>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <Input
            onChange={handleEmailChange}
            onMouseOver={handleEmailChange}
            inputId="email"
            type="email"
            placeholder="Email"
            required
            alert={{ type: "error", text: emailOk?.error }}
          />

          {screen === "signin" && (
            <AnimatePresence>
              {emailOk?.email && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Input
                    inputId="password"
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(e) =>
                      setpassword({ value: e.target.value, error: null })
                    }
                    alert={{ type: "error", text: password?.error }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          )}

          <Button
            disabled={loader}
            onClick={signInUser}
            className="w-full h-12 mt-2 rounded-sm"
          >
            {loader ? (
              <Loader2 className="animate-spin" />
            ) : (
              <span className="capitalize">{screen}</span>
            )}
          </Button>
        </div>

        <div className="flex flex-col items-center gap-2 text-sm justify-between w-full">
          <Link
            href={screen === "forget" ? "/?auth=signin" : "/?auth=forget"}
            className="text-black/50 w-fit font-medium z-10 bg-white underline"
          >
            {screen === "forget" ? "Sign In" : "Forget Password?"}
          </Link>

          <Separator className="w-full -mt-4" />
        </div>

        <SocialAuth />

        <p className="text-xs text-black/50">
          This site is protected by reCAPTCHA and the Google Privacy Policy and
          Terms of Service apply.
        </p>

        <div className="w-full  sm:scale-[1.3] overflow-hidden rounded-md flex justify-center">
          <Turnstile
            retry="auto"
            retryInterval="1000"
            onVerify={(token) => setcaptchaToken(token)}
            sitekey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
            className="rounded"
          />
        </div>
      </div>
    </section>
  );
}

export default GetStarted;

export const SocialAuth = () => {
  const [authLoader, setauthLoader] = useState({
    google: false,
    fb: false,
    task: false,
  });

  return (
    <div className="flex flex-col gap-3">
      <Button
        variant="outline"
        size="lg"
        className="grow py-3 flex justify-between items-center text-md rounded-sm"
        disabled={authLoader.task}
        onClick={() => {
          signIn("google");
          setauthLoader({ google: true, fb: false, task: true });
        }}
      >
        <FcGoogle size={25} />
        {authLoader.google ? <Loader2 className="animate-spin" /> : "Google"}
        <ChevronRight />
      </Button>

      <Button
        variant="outline"
        size="lg"
        className="grow py-3 flex justify-between items-center text-md rounded-sm"
        disabled={authLoader.task}
        onClick={() => {
          signIn("facebook");
          setauthLoader({ fb: true, google: false, task: true });
        }}
      >
        <FaFacebook color="#1877F2" size={25} />
        {authLoader.fb ? <Loader2 className="animate-spin" /> : "Facebook"}
        <ChevronRight />
      </Button>
    </div>
  );
};
