import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import Logo from "../components/ui/Logo/Logo";
import { useState } from "react";
import { ArrowRightIcon, EnvelopeIcon, KeyIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

const RegisterPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!checkPasswordMatch(password, confirmPassword)) {
            setError("Passwords do not match!");
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }), // todo add name and other fields if needed
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed')
            }

            navigate('/login');
        } catch (err) {
            console.error("Registration error:", err);
            setError(err.message || 'An error occurred during registration');
        } finally {
            setIsLoading(false);

            if (error) {
                toast.error(error, {
                    position: 'bottom-center',
                });
            } else {
                toast.success('Registration successful! Please log in.', {
                    position: 'bottom-center',
                });
            }
        }
    }

    return (

        <div className="flex flex-col min-h-[100vh] bg-[#1A1A1E]">
            <HomeNavbar />

            <div className="flex flex-col flex-1 mt-8 items-center justify-between">

                <div className="flex flex-col items-center">
                    <Logo className="w-10 h-auto mb-2" onClickHomepageNavigate={false}/>

                    <div className="flex flex-col justify-center items-center text-center">
                        <h1 className="text-4xl font-bold text-white m-0">Got Trips to Plan?</h1>
                        <p className="text-2xl text-white m-0">Time to make it easy.</p>
                    </div>

                    <form className="flex flex-col gap-4 mt-8 w-sm" onSubmit={handleRegister}>
                        <Input
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<EnvelopeIcon className="w-6"/>}
                        />
                        
                        <Input
                            type="password"
                            label="Password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            icon={<KeyIcon className="w-6"/>}
                        />

                        <Input
                            type="password"
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            icon={<KeyIcon className="w-6"/>}
                        />

                        <Button 
                            text="Sign up"
                            size="full"
                            className='mt-5'
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
                        <a onClick={() => navigate("/login")} className="text-[#9f74fc] text-lg font-bold cursor-pointer ml-2 hover:underline">Sign in</a>
                    </div>
                </div>

                <p className="items-end text-sm opacity-70 mb-5 text-white">Made with ❤️ in Italy</p>
            </div>
        </div>
    )
};

function checkPasswordMatch(password, confirmPassword) {
    return password === confirmPassword;
}

export default RegisterPage;