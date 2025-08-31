'use client'

import { SignedIn, SignedOut, SignUpButton } from '@clerk/nextjs';
import { ArrowRight, Sparkles, Play, X, Download, Share } from 'lucide-react';
import NextImage from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

export default function Hero() {
  const images:string[] = [
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756622093/crezia/ao4n35qhiw7qyoi4lswd.png",
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756615594/crezia/rp7p1rf9qkev6oux52gh.png",
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756624119/crezia/x1jdhp2ctjtnkfd3gyhu.png",
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756625439/crezia/itjxsvvleerlz0q0im6a.png",
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756625853/crezia/k6nlcoeh4c59veui4wyq.png",
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756614834/crezia/z5e1gfjtww3gyfo7ae8l.png",
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756617890/crezia/zm2u53e7fn4yxvts5vqk.png",
    "https://res.cloudinary.com/dqznmhhtv/image/upload/v1756626252/crezia/je8ojd7dls7zz33uphtm.png"
  ];
  
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleDownload = async () => {
    if (!selectedImage) return;
    
    try {
      const response = await fetch(selectedImage);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = 'thumbnail.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };
  
  const handleShare = async () => {
    if (!selectedImage) return;
    
    try {
      if (navigator.share) {
        const response = await fetch(selectedImage);
        const blob = await response.blob();
        const file = new File([blob], 'thumbnail.png', { type: blob.type });
        
        await navigator.share({
          title: 'Check out this thumbnail',
          files: [file]
        });
      } else {
        await navigator.clipboard.writeText(selectedImage);
        alert('Image link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing image:', error);
    }
  };

  return (
    <>
      <section className="relative z-10 px-6 pb-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center space-x-2 bg-gray-900/50 backdrop-blur-sm px-4 py-2 rounded-full mb-8 border border-gray-800">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-gray-300">AI-Powered Visual Creation</span>
          </div>
          
          <h1 className="text-5xl md:text-5xl font-bold mb-6 leading-tight">
            Create Thumbnails
            in Seconds
          </h1>
          
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Transform your content with AI-powered thumbnail generation. Create professional visuals that drive clicks and engagement across all platforms.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {images.map((src, i) => (
              <div
                key={i}
                className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:scale-105 shadow-xl overflow-hidden cursor-pointer"
                onClick={() => setSelectedImage(src)}
              >
                <NextImage
                  height={210}
                  width={210}
                  src={src}
                  alt={`Thumbnail ${i + 1}`}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-16">
            <div className="group bg-white text-black px-8 py-4 rounded-full hover:bg-gray-100 transition-all duration-300 flex items-center space-x-2 shadow-2xl hover:shadow-white/20 font-medium text-lg">
              <SignedOut>
                <SignUpButton/>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </SignedOut>
              <SignedIn>
                <Link href='/dashboard'>Go to Dashboard</Link>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </SignedIn>
            </div>
            
            <button className="group border border-gray-700 px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all duration-300 flex items-center space-x-2 font-medium text-lg">
              <Play className="w-5 h-5" />
              <span>Watch Demo</span>
            </button>
          </div>
        </div>
      </section>
      
      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative bg-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <button
              className="absolute top-4 right-4 z-10 bg-gray-800 hover:bg-gray-700 rounded-full p-2 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative h-full w-full flex flex-col">
              <div className="flex-1 overflow-hidden flex items-center justify-center p-4">
                <NextImage
                  src={selectedImage}
                  alt="Enlarged thumbnail"
                  width={600}
                  height={400}
                  className="object-contain max-h-[70vh]"
                />
              </div>
              
              <div className="flex justify-center gap-4 p-4 border-t border-gray-800">
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 bg-black/90 px-4 py-2 rounded-lg transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 bg-white px-4 rounded-lg transition-colors text-black"
                >
                  <Share className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}