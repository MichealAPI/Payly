import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Bars3Icon, ChatBubbleLeftRightIcon, AcademicCapIcon } from '@heroicons/react/24/outline';
import Button from '../Button/Button';
import logo from '../../../assets/logo.png';

const navLinks = [
    { name: 'Discord', href: '#', icon: ChatBubbleLeftRightIcon, target: '_blank'},
    { name: 'GitHub', href: 'https://github.com/MichealAPI/Payly', icon: AcademicCapIcon, target: '_blank' },
];

const HomeNavbar = () => {
    return (
        <nav className="flex justify-between items-center p-4 md:bg-transparent bg-gray-500/10 w-full">
            {/* Logo and Desktop Title */}
            <div className="flex gap-3 justify-center items-center">
                <img src={logo} alt="Payly Logo" className="w-8 hidden md:block h-auto" />
                <h3 className="font-bold text-white text-xl hidden md:block">Payly</h3>
            </div>

            {/* Desktop Links */}
            <div className="gap-3 hidden md:flex text-white font-bold items-center">
                {navLinks.map((link) => (
                    <a key={link.name} href={link.href} target={link.target} className="hover:text-[#9f74fc] transition-colors">{link.name}</a>
                ))}
                <a href="#" className='hover:text-[#9f74fc] transition-colors'>Log-in</a>
            </div>

            {/* Mobile Menu and Sign-in Button */}
            <div className="flex w-full items-center justify-between gap-4 md:hidden">
                <Menu>
                    <MenuButton className="cursor-pointer group inline-flex items-center gap-2 rounded-md outline-white outline-1 px-3 py-1.5 text-sm/6 font-semibold text-white">
                        <Bars3Icon className="size-4 fill-white/60 transition-transform duration-150 group-data-[open]:rotate-90" />
                    </MenuButton>
                    <MenuItems
                        transition
                        anchor="bottom end"
                        className="w-40 z-50 origin-top-right rounded-xl border border-purple-400/30 bg-[#121214] p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:--spacing(1)] focus:outline-none data-closed:scale-95 data-closed:opacity-0"
                    >
                        {navLinks.map((link) => (
                             <MenuItem key={link.name}>
                                <a href={link.href} target={link.target} className="group flex w-full items-center gap-2 rounded-lg px-3 py-1.5 data-focus:bg-white/10">
                                    <link.icon className="size-4" />
                                    {link.name}
                                </a>
                            </MenuItem>
                        ))}
                    </MenuItems>
                </Menu>
                <Button 
                    text="Sign in"
                    size="medium"
                    textVisibility={true}
                    onClick={() => alert('Sign in clicked!')}
                    style="outline"
                /> 
            </div>
        </nav>
    );
};

export default HomeNavbar;