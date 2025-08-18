import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import Logo from "../components/ui/Logo/Logo";
import { useState } from "react";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  KeyIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { loginUser } from "../features/auth/authSlice";
import { useDispatch, useSelector } from "react-redux";

const LoginPage = () => {
  const dispatch = useDispatch();
  const { error, currentUser, isLoading } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  const isSubmitDisabled =
    isLoading || !isValidEmail(email) || password.length < 6;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await dispatch(loginUser({ email: email.trim(), password })).unwrap();
      toast.success("Login successful!", { position: "bottom-center" });
      navigate("/groups", { replace: true });
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || error || "An error occurred during login";
      console.error("Login error:", message);
      toast.error(message, { position: "bottom-center" });
    }
  };

  if (currentUser) {
    navigate("/groups", { replace: true });
  }

  const dotsBackground = "dark:bg-[radial-gradient(circle_at_10px_10px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:30px_30px] bg-[radial-gradient(circle_at_10px_10px,_rgba(0,0,0,0.15)_1px,_transparent_0)]";

  return (
    <div className={`flex flex-col min-h-[100vh] dark:bg-primary bg-dark-gray ${dotsBackground}`}>
      <HomeNavbar />

      <main
        className="flex flex-col flex-1 items-center justify-center relative"
        role="main"
      >
        {/* Glow wrapper + glass card */}
        <div className="relative md:mb-60 mb-20">
          {/* Purple glow behind the card */}
          <div
            className="hidden md:block absolute -inset-x-24 -inset-y-16 bg-gradient-to-br from-fuchsia-500/12 via-purple-500/5 to-transparent blur-3xl rounded-[2rem] pointer-events-none"
            aria-hidden="true"
          />

          {/* Glass effect card */}
          <div className="flex flex-col items-center w-[80vw] outline-1 outline-secondary/30 max-w-sm md:max-w-md bg-transparent md:bg-white/20 dark:md:bg-white/5 md:backdrop-blur-xl md:pb-[2.5vw] md:pt-[2.5vw] md:pl-[2vw] md:pr-[2vw] md:border md:border-white/20 md:rounded-2xl md:shadow-2xl md:shadow-purple-500/20 md:focus-within:ring-2 md:focus-within:ring-purple-400/40">
            <div className="flex items-center flex-col gap-2">
              <Logo className="w-12 h-12 bg-radial from-dark-gray/60 to-primary outline-secondary/10 p-3 rounded-xl outline-1 dark:outline-white/10" onClickHomepageNavigate={false}/>

              <h1 className="text-secondary text-2xl font-medium mb-2">
                Log in to Payly
              </h1>
            </div>

            <form
              className="flex flex-col gap-4 mt-8 w-full max-w-sm relative"
              onSubmit={handleLogin}
              aria-describedby="login-instructions"
            >
              <p id="login-instructions" className="sr-only">
                Enter your email address and password to sign in. Password must be
                at least 6 characters.
              </p>

              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                autoFocus
                required
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                icon={<EnvelopeIcon className="w-6" />}
                disabled={isLoading}
                aria-label="Email address"
                aria-invalid={email.length > 0 && !isValidEmail(email)}
                aria-describedby="email-hint"
              />
              <p id="email-hint" className="sr-only">
                Use a valid email address like name@example.com.
              </p>

              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                rightLabel={
                  <Link
                    className="hover:text-blue-400 transition-colors font-medium text-tertiary text-base"
                    to="/forgot"
                    aria-label="Forgot your password?"
                  >
                    forgot?
                  </Link>
                }
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                icon={<KeyIcon className="w-6" />}
                disabled={isLoading}
                aria-label="Password"
                aria-invalid={password.length > 0 && password.length < 6}
                aria-describedby="password-hint"
              />
              <p id="password-hint" className="sr-only">
                Password must be at least 6 characters.
              </p>

              <Button
                text={isLoading ? "Logging in..." : "Sign In"}
                size="full"
                disabled={isSubmitDisabled}
                className="mt-5 text-white"
                textVisibility={true}
                style="fill"
                type="submit"
                aria-busy={isLoading}
              />
            </form>

            <div className="flex mt-10">
              <p className="text-secondary text-lg">Don't have an account?</p>
              <Link
                to="/register"
                className="text-[#9f74fc] text-lg cursor-pointer ml-1.5 hover:underline"
              >
                Sign up
              </Link>
            </div>
          </div>
        </div>

        <p
          className="absolute bottom-5 text-sm opacity-70 text-secondary"
          aria-label="Made with love in Italy"
        >
          Made with <span aria-hidden="true">❤️</span> in Italy
        </p>
      </main>
    </div>
  );
};

export default LoginPage;
