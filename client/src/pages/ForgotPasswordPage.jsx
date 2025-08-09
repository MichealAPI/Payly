import HomeNavbar from "../components/ui/HomeNavbar/HomeNavbar";
import Input from "../components/ui/Input/Input";
import Button from "../components/ui/Button/Button";
import Logo from "../components/ui/Logo/Logo";
import { useState } from "react";
import { ArrowRightIcon, EnvelopeIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');

    return (
        <div className="flex flex-col min-h-[100vh] bg-[#1A1A1E]">
            <HomeNavbar />

            <div className="flex flex-col flex-1 mt-8 items-center justify-between">

                <div className="flex flex-col items-center">
                    <Logo className="w-10 h-auto mb-2" onClickHomepageNavigate={false}/>

                    <div className="flex flex-col justify-center items-center text-center">
                        <h1 className="text-4xl font-bold text-white m-0">Password Reset</h1>
                        <p className="text-2xl text-white m-0">We'll email you a reset link</p>
                    </div>

                    <form className="flex flex-col gap-4 mt-8 w-sm" onSubmit={(e) => e.preventDefault()}>
                        <Input
                            type="email"
                            label="Email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            icon={<EnvelopeIcon className="w-6"/>}
                        />

                        <Button 
                            text="Send Verification Email"
                            size="full"
                            className='mt-5'
                            textVisibility={true}
                            iconVisibility={true}
                            icon={<ArrowRightIcon className="w-6" />}
                            onClick={() => {
                                // Proceed with reset logic
                            }} /* Todo: implement reset logic */
                            style="fill"
                            type="submit"
                        />
                    </form>

                    <ArrowLeftIcon onClick={() => navigate("/login")} className="mt-20 w-8 h-auto text-white cursor-pointer hover:text-purple-400 transition-colors" />

                </div>

                <p className="items-end text-sm opacity-70 mb-5 text-white">Made with ❤️ in Italy</p>
            </div>
        </div>
    )
};


export default ForgotPasswordPage;