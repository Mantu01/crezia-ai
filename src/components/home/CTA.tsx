import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import { ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function CTA() {
  return (
    <section className="relative z-10 px-6 py-20">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Transform
          <br />
          Your Content?
        </h2>
        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
          Join thousands of creators who are already using Crezia to boost their engagement
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="group bg-white text-black px-10 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-2xl hover:shadow-white/20 font-medium text-lg">
            <SignedOut>
              <SignUpButton/>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </SignedOut>
            <SignedIn>
              <Link href='/dashboard'>Go to Dashboard</Link>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </SignedIn>
          </div>
          
          <div className="flex items-center space-x-2 text-gray-400">
            <CheckCircle className="w-5 h-5" />
            <span>No credit card required</span>
          </div>
        </div>
      </div>
    </section>
  );
}