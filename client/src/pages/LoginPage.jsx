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
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";


const LoginPage = () => {
  const navigate = useNavigate();
  const {setUser} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Login failed");
        throw new Error(data.message || "Login failed");
      }

      setUser(data.user);

      toast.success("Login successful!", { position: "bottom-center" });
      console.log("Login successful:", data);
      
      navigate("/groups");
    } catch (err) {
      console.error("Login error:", err);
      toast.error(err.message || "An error occurred during login", {
        position: "bottom-center",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-[100vh] bg-[#1A1A1E]">
      <HomeNavbar />

      <div className="flex flex-col flex-1 mt-8 items-center justify-between">
        <div className="flex flex-col items-center">
          <Logo className="w-10 h-auto mb-2" onClickHomepageNavigate={false} />

          <div className="flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl font-bold text-white m-0">Welcome Back!</h1>
            <p className="text-2xl text-white m-0">Sign in to continue</p>
          </div>

          <form
            className="flex flex-col gap-4 mt-8 w-xs md:w-sm"
            onSubmit={handleLogin}
          >
            <Input
              type="email"
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<EnvelopeIcon className="w-6" />}
            />

            <Input
              type="password"
              label="Password"
              rightLabel={
                <a
                  className="hover:text-blue-400 transition-colors font-bold text-blue-600 text-xs cursor-pointer"
                  onClick={() => navigate("/forgot")}
                >
                  forgot?
                </a>
              }
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<KeyIcon className="w-6" />}
            />

            <Button
              text="Sign in"
              size="full"
              className="mt-5"
              textVisibility={true}
              iconVisibility={true}
              icon={<ArrowRightIcon className="w-6" />}
              style="fill"
              type="submit"
            />
          </form>

          <div className="flex mt-5">
            <p className="text-white text-lg">Don't have an account?</p>
            <a
              onClick={() => navigate("/register")}
              className="text-[#9f74fc] text-lg font-bold cursor-pointer ml-2 hover:underline"
            >
              Sign up
            </a>
          </div>
        </div>

        <p className="items-end text-sm opacity-70 mb-5 text-white">
          Made with ❤️ in Italy
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
