import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import Logo from "../components/ui/Logo/Logo";
import { useState } from "react";
import {
  ArrowRightIcon,
  EnvelopeIcon,
  KeyIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!checkPasswordMatch(password, confirmPassword)) {
      setError("Passwords do not match!");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err);
      setError(err.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);

      if (error) {
        toast.error(error, {
          position: "bottom-center",
        });
      } else {
        toast.success("Registration successful! Please log in.", {
          position: "bottom-center",
        });
      }
    }
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#1A1A1E]">
      <HomeNavbar />

      <div className="flex flex-col flex-1 mt-8 items-center justify-between">
        <div className="flex flex-col items-center">
          <Logo />
          <h1 className="text-3xl font-bold text-white mt-4">
            Create an Account
          </h1>
          <p className="text-white/60 mt-2">
            Join Payly to start managing your group expenses.
          </p>
        </div>

        <form
          onSubmit={handleRegister}
          className="flex flex-col gap-4 w-full max-w-sm"
        >
          <div className="flex gap-4">
            <Input
              id="firstName"
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              icon={<UserIcon className="w-5" />}
              required
            />
            <Input
              id="lastName"
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              icon={<UserIcon className="w-5" />}
              required
            />
          </div>
          <Input
            id="email"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<EnvelopeIcon className="w-5" />}
            required
          />
          <Input
            id="password"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={<KeyIcon className="w-5" />}
            required
          />
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={<KeyIcon className="w-5" />}
            required
          />

          <Button
            text="Sign up"
            size="full"
            className="mt-5"
            textVisibility={true}
            iconVisibility={true}
            icon={<ArrowRightIcon className="w-6" />}
            style="fill"
            type="submit"
            disabled={isLoading}
          />
        </form>

        <div className="flex mt-5">
          <p className="text-white text-lg">Already have an account?</p>
          <a
            onClick={() => navigate("/login")}
            className="text-[#9f74fc] text-lg font-bold cursor-pointer ml-2 hover:underline"
          >
            Sign in
          </a>
        </div>
      </div>

      <p className="items-end text-sm opacity-70 mb-5 text-white">
        Made with ❤️ in Italy
      </p>
    </div>
  );
};

function checkPasswordMatch(password, confirmPassword) {
  return password === confirmPassword;
}

export default RegisterPage;