import React from 'react';
import Button from '../components/ui/Button/Button';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import HomeNavbar from '../components/ui/HomeNavbar/HomeNavbar';
import heroImage from '../assets/hero-image.png';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {

    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-[100vh] bg-[radial-gradient(circle_at_10px_10px,_rgba(255,255,255,0.15)_1px,_transparent_0)] bg-[length:30px_30px]">
            <HomeNavbar />

            <main className="flex flex-1 justify-center md:justify-between items-center md:p-20 p-5">
                
                <div className="flex flex-col gap-8 text-center md:text-left">

                    <div className="flex flex-col gap-3 md:items-stretch items-center">

                        <img src={logo} alt="Payly Logo" className="w-10 h-auto mb-2 block md:hidden" />

                        <h1 className="text-4xl md:text-5xl font-bold text-white m-0">
                            Who said counting<br className="hidden md:block" /> expenses wasn't easy?
                        </h1>
                        
                        <p className="text-lg text-white opacity-60">
                            Discover our newest tracking features and simplify your expenses.
                        </p>
                    </div>

                    <div className="flex w-full justify-center md:justify-start items-center flex-col sm:flex-row gap-4">
                        <Button 
                            text="Sign Up"
                            size="medium"
                            textVisibility={true}
                            onClick={() => navigate('/register')}
                            style="fill"
                            className="w-full sm:w-auto"
                        /> 

                        <Button 
                            text="Learn More"
                            size="medium"
                            textVisibility={true}
                            iconVisibility={true}
                            icon={<ArrowRightIcon className="w-6" />}
                            onClick={() => alert('Learn More clicked!')}
                            style="outline"
                            className="w-full sm:w-auto"
                        /> 
                    </div>
                </div>

                <img src={heroImage} alt="Payly application screenshot" className="w-1/3 h-auto hidden md:block select-none pointer-events-none" />
            </main>

        </div>
    );
}

export default HomePage;