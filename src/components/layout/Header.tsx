'use client';

import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from '../logo/Logo';
import Link from 'next/link';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/nextjs';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <nav>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo />
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#features" className="text-gray-300 hover:text-white transition-colors">Features</Link>
            <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-colors">About</Link>
            <div className="flex items-center space-x-4">
              <SignedOut>
                <div className="bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium"><SignInButton/></div>
              </SignedOut>
              <SignedIn>
                <UserButton/>
              </SignedIn>
            </div>
          </div>

          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/95 backdrop-blur-lg border-t border-gray-800">
            <div className="px-6 py-4 space-y-4">
              <Link href="#features" className="block text-gray-300 hover:text-white transition-colors">Features</Link>
              <Link href="#pricing" className="block text-gray-300 hover:text-white transition-colors">Pricing</Link>
              <Link href="#about" className="block text-gray-300 hover:text-white transition-colors">About</Link>
              <button className="w-full bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium">
                <SignedOut>
                  <div className="w-full bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium"><SignInButton/></div>
                </SignedOut>
                <SignedIn>
                 <Link href='/dashboard' className="w-full bg-white text-black px-6 py-2 rounded-full hover:bg-gray-100 transition-colors font-medium">Dashboard</Link>
                </SignedIn>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}