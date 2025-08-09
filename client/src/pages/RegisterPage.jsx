import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import Logo from "../components/ui/Logo/Logo";
import { useState } from "react";
import { EnvelopeIcon, KeyIcon, UserIcon } from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import DatePicker from "../components/ui/DatePicker/DatePicker";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [sex, setSex] = useState(""); // 'male' | 'female' | 'other'
  const [dob, setDob] = useState(null); // Date
  const [step, setStep] = useState(0); // 0: credentials, 1: profile
  const [isLoading, setIsLoading] = useState(false);

  const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  // Step-specific disabled states
  const isContinueDisabled =
    isLoading || !isValidEmail(email) || password.length < 6;
  const isCreateDisabled =
    isLoading ||
    !firstName.trim() ||
    !lastName.trim() ||
    !dob ||
    !sex ||
    password !== confirmPassword;

  const handleRegister = async () => {
    setIsLoading(true);

    // Client-side validation
  if (!firstName.trim() || !lastName.trim()) {
      toast.error("Please enter your first and last name.", {
        position: "bottom-center",
      });
      setIsLoading(false);
      return;
    }
  if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.", {
        position: "bottom-center",
      });
      setIsLoading(false);
      return;
    }
  if (password.length < 6) {
      toast.error("Password must be at least 6 characters.", {
        position: "bottom-center",
      });
      setIsLoading(false);
      return;
    }
  if (password !== confirmPassword) {
      toast.error("Passwords do not match!", { position: "bottom-center" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          email: email.trim(),
          password,
        }),
      });

  const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.message || "Registration failed");
      }

      toast.success("Registration successful! Please log in.", {
        position: "bottom-center",
      });
      navigate("/login", { replace: true });
    } catch (err) {
      const message =
        typeof err === "string"
          ? err
          : err?.message || "An error occurred during registration";
      console.error("Registration error:", message);
      toast.error(message, { position: "bottom-center" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 0) {
      if (!isValidEmail(email)) {
        toast.error("Please enter a valid email address.", {
          position: "bottom-center",
        });
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters.", {
          position: "bottom-center",
        });
        return;
      }
      setStep(1);
      return;
    }
    await handleRegister();
  };

  const cardVariants = {
    initial: { opacity: 0, y: 16, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -16, scale: 0.98 },
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-black md:bg-[radial-gradient(circle_at_10px_10px,_rgba(255,255,255,0.15)_1px,_transparent_0)] md:bg-[length:30px_30px]">
      <HomeNavbar />

      <main className="flex flex-col flex-1 items-center justify-center relative" role="main">
        <div className="relative md:mb-60">
          {/* Purple glow behind the card */}
          <div
            className="hidden md:block absolute -inset-x-24 -inset-y-16 bg-gradient-to-br from-fuchsia-500/12 via-purple-500/5 to-transparent blur-3xl rounded-[2rem] pointer-events-none"
            aria-hidden="true"
          />

          {/* Glass effect card with animated steps */}
          <motion.div
            layout
            transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
            className="flex flex-col items-center bg-transparent md:bg-white/5 md:backdrop-blur-xl md:pb-[2.5vw] md:pt-[2.5vw] md:pl-[2vw] md:pr-[2vw] md:border md:border-white/20 md:rounded-2xl md:shadow-2xl md:shadow-purple-500/20 md:focus-within:ring-2 md:focus-within:ring-purple-400/40 w-[90vw] max-w-sm md:max-w-md"
          >
            <div className="flex items-center flex-col gap-2">
              <Logo
                className="w-12 h-12 bg-radial from-gray-700/60 to-black p-3 rounded-xl outline-1 outline-white/10"
                onClickHomepageNavigate={false}
              />
              <h1 className="text-white text-2xl font-medium mb-2">
                {step === 0 ? "Create your Payly account" : "Let’s get to know you better"}
              </h1>
            </div>

            <motion.form
              layout
              onSubmit={handleSubmit}
              className="mt-8 w-full max-w-sm relative"
              transition={{ layout: { duration: 0.3, ease: "easeInOut" } }}
            >
              <AnimatePresence mode="popLayout" initial={false}>
        {step === 0 ? (
                  <motion.div
                    key="step-credentials"
          layout
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <Input
                      id="email"
                      type="email"
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      icon={<EnvelopeIcon className="w-6" />}
                    />
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      icon={<KeyIcon className="w-6" />}
                    />
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      icon={<KeyIcon className="w-6" />}
                    />

                    <Button
                      text={"Continue"}
                      size="full"
                      disabled={isContinueDisabled || password !== confirmPassword}
                      className="mt-4"
                      textVisibility={true}
                      style="fill"
                      type="submit"
                    />
                  </motion.div>
        ) : (
                  <motion.div
                    key="step-profile"
          layout
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ duration: 0.28, ease: "easeOut" }}
                    className="flex flex-col gap-4"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        icon={<UserIcon className="w-6" />}
                      />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        icon={<UserIcon className="w-6" />}
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-md font-sans text-white/60 m-0">Date of birth</p>
                      <DatePicker date={dob} setDate={setDob} />
                    </div>

                    <div className="flex flex-col gap-2">
                      <p className="text-md font-sans text-white/60 m-0">Sex</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: "male", label: "Male" },
                          { key: "female", label: "Female" },
                          { key: "other", label: "Other" },
                        ].map(({ key, label }) => {
                          const selected = sex === key;
                          return (
                            <Button
                              key={key}
                              text={label}
                              size="full"
                              style={selected ? "fill" : "outline"}
                              className={`py-2 ${selected ? "" : "border-white/40 text-white"}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setSex(key);
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2 gap-3">
                      <Button
                        text="Back"
                        size="medium"
                        style="outline"
                        className="border-white/50 text-white"
                        onClick={(e) => {
                          e.preventDefault();
                          setStep(0);
                        }}
                      />
                      <Button
                        text={isLoading ? "Creating..." : "Create account"}
                        size="medium"
                        disabled={isCreateDisabled}
                        textVisibility={true}
                        style="fill"
                        type="submit"
                      />
                    </div>
      </motion.div>
                )}
              </AnimatePresence>
    </motion.form>

            <div className="flex mt-10">
              <p className="text-white text-lg">Already have an account?</p>
              <Link
                to="/login"
                className="text-[#9f74fc] text-lg cursor-pointer ml-1.5 hover:underline"
              >
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>

        <p
          className="absolute bottom-5 text-sm opacity-70 text-white"
          aria-label="Made with love in Italy"
        >
          Made with <span aria-hidden="true">❤️</span> in Italy
        </p>
      </main>
    </div>
  );
};

export default RegisterPage;