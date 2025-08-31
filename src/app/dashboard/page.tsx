'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import NextImage from 'next/image';
import { Upload, ImageIcon, Download, Copy, Share2, Palette, Zap, RefreshCw, History, Monitor, Trash2, FileText, Type, Clock, AlertCircle, X, ExternalLink, Heart, Star, Coins } from 'lucide-react';

interface HistoryItem {
  id: number;
  url: string;
  title: string;
  description: string;
  position: string;
  date: string;
  timestamp: number;
}

const CreziaDashboard: React.FC = () => {
  const [uploadedImage, setUploadedImage] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageDimensions, setImageDimensions] = useState<{ width: number, height: number } | null>(null);
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [position, setPosition] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string>('');
  const [generatedThumbnail, setGeneratedThumbnail] = useState<string>('');
  const [sidebarWidth, setSidebarWidth] = useState(350);
  const [credits, setCredits] = useState<number>(3);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const [showModal, setShowModal] = useState(false);
  const sidebarRef = useRef<HTMLElement>(null);

  const isFormComplete = uploadedImage && title && description && position;

  useEffect(() => {
    const savedCredits = localStorage.getItem('crezia_credits');
    const savedHistory = localStorage.getItem('crezia_history');
    
    if (savedCredits) {
      setCredits(parseInt(savedCredits));
    } else {
      localStorage.setItem('crezia_credits', '3');
    }
    
    if (savedHistory) {
      setHistoryItems(JSON.parse(savedHistory));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('crezia_credits', credits.toString());
  }, [credits]);

  useEffect(() => {
    localStorage.setItem('crezia_history', JSON.stringify(historyItems));
  }, [historyItems]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const minWidth = 300;
    const maxWidth = 500;
    const newWidth = e.clientX;
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      setSidebarWidth(newWidth);
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        const img = new window.Image();
        img.onload = () => {
          setImageDimensions({ width: img.naturalWidth, height: img.naturalHeight });
        };
        img.src = imageUrl;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReplaceImage = () => {
    setUploadedImage('');
    setImageFile(null);
    setImageDimensions(null);
  };

  const handleGenerate = async () => {
    if (!isFormComplete || credits <= 0) return;

    setIsGenerating(true);
    setGeneratedThumbnail('');
    setGenerationError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('position', position);
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      const response = await fetch('/api/design', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.thumbnail && typeof data.thumbnail === 'string') {
        setGeneratedThumbnail(data.thumbnail);
        setCredits(prev => prev - 1);
        
        const newHistoryItem: HistoryItem = {
          id: Date.now(),
          url: data.thumbnail,
          title: title,
          description: description,
          position: position,
          date: 'Just now',
          timestamp: Date.now()
        };
        
        setHistoryItems(prev => [newHistoryItem, ...prev]);
      } else {
        throw new Error('Invalid API response format.');
      }
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      //@ts-expect-error: unknown
      setGenerationError(error.message || 'Failed to generate thumbnail. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleItemClick = (item: HistoryItem | { url: string, title: string, description: string, position: string }) => {
    const historyItem: HistoryItem = 'id' in item ? item : {
      id: Date.now(),
      url: item.url,
      title: item.title,
      description: item.description,
      position: item.position,
      date: 'Current',
      timestamp: Date.now()
    };
    setSelectedItem(historyItem);
    setShowModal(true);
  };

  const handleDownload = async (url: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `crezia-thumbnail-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const handleShare = async (url: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out this thumbnail',
          url: url,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    } else {
      handleCopy(url);
    }
  };

  const handleDeleteHistory = (id: number) => {
    setHistoryItems(prev => prev.filter(item => item.id !== id));
  };

  const clearAllHistory = () => {
    setHistoryItems([]);
    localStorage.removeItem('crezia_history');
  };

  return (
    <div className="flex h-screen bg-black text-white font-sans text-sm overflow-hidden pt-16">
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #404040; border-radius: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #606060; }
        .premium-textarea { resize: vertical; min-height: 80px; max-height: 200px; }
        body { overflow: hidden; }
        .backdrop-blur-premium { backdrop-filter: blur(20px); }
      `}</style>

      <aside
        ref={sidebarRef}
        style={{ width: `${sidebarWidth}px` }}
        className="bg-[#0a0a0a] border-r border-gray-800 flex flex-col"
      >
        <div className="p-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center">
            <Palette className="w-5 h-5 mr-2 text-gray-300" />
            Crezia Studio
          </h2>
          <div className="flex items-center space-x-2">
            <Coins className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-semibold text-yellow-500">{credits}</span>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
          <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-800/60 shadow-lg">
            <h3 className="text-xs font-semibold mb-3 flex items-center text-gray-300">
              <Upload className="w-3.5 h-3.5 mr-2" />
              Upload Image
            </h3>
            {!uploadedImage ? (
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-6 text-center hover:border-gray-500 transition-all duration-300 hover:bg-gray-900/20">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-500" />
                  <p className="text-xs text-gray-300 mb-1">Drop image here</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
                <input type="file" className="hidden" accept="image/png, image/jpeg" onChange={handleImageUpload} />
              </label>
            ) : (
              <div>
                <NextImage 
                  src={uploadedImage} 
                  alt="Uploaded"
                  width={imageDimensions?.width || 200}
                  height={imageDimensions?.height || 200}
                  className="w-full h-auto object-contain rounded-xl max-h-48 shadow-md" 
                />
                <button
                  onClick={handleReplaceImage}
                  className="mt-3 w-full bg-gray-800 hover:bg-gray-700 py-2 px-3 rounded-lg text-xs transition-all duration-300 flex items-center justify-center shadow-sm"
                >
                  <RefreshCw className="w-3 h-3 mr-2" />
                  Replace Image
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-900/40 rounded-xl p-4 border border-gray-800/60 shadow-lg space-y-4">
            <div>
              <label className="text-xs font-semibold mb-2 flex items-center text-gray-300">
                <Type className="w-3.5 h-3.5 mr-2" />
                Title
              </label>
              <input
                type="text" value={title} onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., My Epic Gaming Montage"
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
              />
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 flex items-center text-gray-300">
                <FileText className="w-3.5 h-3.5 mr-2" />
                Description
              </label>
              <textarea
                value={description} onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your thumbnail idea in detail..."
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300 premium-textarea custom-scrollbar"
              />
              <p className="text-xs text-gray-500 mt-1 text-right">{description.length}/500</p>
            </div>
            <div>
              <label className="text-xs font-semibold mb-2 flex items-center text-gray-300">
                <Monitor className="w-3.5 h-3.5 mr-2" />
                Image Position
              </label>
              <select
                value={position} onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-gray-800/80 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-transparent transition-all duration-300"
              >
                <option value="">Select Position</option>
                <option value="left">Left</option>
                <option value="centre">Centre</option>
                <option value="right">Right</option>
              </select>
            </div>
          </div>
          
          <button 
            onClick={handleGenerate} 
            disabled={!isFormComplete || isGenerating || credits <= 0} 
            className="w-full bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg text-sm"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating...</span>
              </>
            ) : credits <= 0 ? (
              <>
                <AlertCircle className="w-4 h-4" />
                <span>No Credits</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Generate ({credits} credits)</span>
              </>
            )}
          </button>

          {credits <= 0 && (
            <div className="bg-red-900/20 border border-red-800 rounded-xl p-3 text-center">
              <AlertCircle className="w-5 h-5 mx-auto mb-2 text-red-400" />
              <p className="text-xs text-red-400 font-semibold">Out of credits!</p>
              <p className="text-xs text-red-500 mt-1">Upgrade to continue generating</p>
            </div>
          )}
        </div>
      </aside>

      <div className="w-1.5 cursor-col-resize bg-gray-900 hover:bg-gray-700 transition-colors" onMouseDown={handleMouseDown}/>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-200">Your Creations</h1>
            {historyItems.length > 0 && (
              <button
                onClick={clearAllHistory}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors flex items-center"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Clear All
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {(generatedThumbnail || isGenerating || generationError) && (
            <div className="p-6 border-b border-gray-800/50">
              <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
                <Zap className="w-4 h-4 mr-2" />
                Latest Generation
              </h2>
              <div className="flex items-center justify-center">
                {isGenerating ? (
                  <div className="w-full max-w-lg space-y-4">
                    <div className="bg-gray-900/50 rounded-xl aspect-[16/9] animate-pulse border border-gray-800 shadow-lg" />
                    <div className="bg-gray-900/50 rounded-lg h-12 animate-pulse border border-gray-800" />
                  </div>
                ) : generationError ? (
                  <div className="text-center text-red-400 bg-red-900/10 rounded-xl p-6 border border-red-800/30">
                    <AlertCircle className="w-12 h-12 mx-auto mb-3" />
                    <p className="font-semibold text-base mb-2">Generation Failed</p>
                    <p className="text-xs text-gray-500">{generationError}</p>
                  </div>
                ) : generatedThumbnail ? (
                  <div 
                    onClick={() => handleItemClick({ url: generatedThumbnail, title, description, position })}
                    className="w-full max-w-lg cursor-pointer group"
                  >
                    <div className="bg-gray-900/30 rounded-xl p-3 border border-gray-800/60 shadow-xl hover:shadow-2xl hover:border-gray-700 transition-all duration-300 transform hover:scale-105">
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-lg">
                        <NextImage 
                          src={generatedThumbnail} 
                          alt="Generated Thumbnail" 
                          width={1280} 
                          height={1280}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Click to view details
                        </p>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          )}

          <div className="p-6">
            <h2 className="text-sm font-semibold text-gray-300 mb-4 flex items-center">
              <History className="w-4 h-4 mr-2" />
              History ({historyItems.length})
            </h2>
            {historyItems.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                {historyItems.map((item) => (
                  <div key={item.id} className="group">
                    <div 
                      onClick={() => handleItemClick(item)}
                      className="bg-gray-900/40 rounded-xl p-2 border border-gray-800/60 hover:border-gray-700 transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-white/5 transform hover:scale-105"
                    >
                      <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-2">
                        <NextImage 
                          src={item.url} 
                          alt={item.title} 
                          width={1280} 
                          height={1280} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                        />
                      </div>
                      <div className="px-1">
                        <p className="text-xs font-medium truncate text-gray-200">{item.title}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteHistory(item.id);
                      }}
                      className="mt-2 w-full text-xs text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 py-12">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="font-semibold text-base text-gray-400 mb-1">No history yet</p>
                <p className="text-xs">Your generated thumbnails will appear here</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {showModal && selectedItem && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-premium flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-2xl border border-gray-700 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-gray-800">
              <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-center">
                <div className="max-w-2xl w-full">
                  <NextImage 
                    src={selectedItem.url} 
                    alt={selectedItem.title}
                    width={1280}
                    height={1280}
                    className="w-full h-auto object-contain rounded-xl shadow-lg"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-1">Title</p>
                    <p className="text-sm text-gray-200">{selectedItem.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-1">Description</p>
                    <p className="text-sm text-gray-200">{selectedItem.description}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-1">Position</p>
                    <p className="text-sm bg-gray-800 text-gray-200 inline-block px-3 py-1 rounded-lg capitalize">{selectedItem.position}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-semibold mb-1">Created</p>
                    <p className="text-sm text-gray-200 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {selectedItem.date}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <p className="text-xs text-gray-400 font-semibold">Actions</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleDownload(selectedItem.url)}
                      className="bg-white text-black py-2.5 px-4 rounded-lg text-sm hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2 font-semibold"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download</span>
                    </button>
                    <button 
                      onClick={() => handleCopy(selectedItem.url)}
                      className="bg-gray-800 hover:bg-gray-700 py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </button>
                    <button 
                      onClick={() => handleShare(selectedItem.url)}
                      className="bg-gray-800 hover:bg-gray-700 py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <button 
                      onClick={() => {
                        if ('id' in selectedItem) {
                          handleDeleteHistory(selectedItem.id);
                          setShowModal(false);
                        }
                      }}
                      className="bg-red-900/30 hover:bg-red-900/50 text-red-400 py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 border border-red-800/30"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                  
                  <div className="pt-4 border-t border-gray-800">
                    <p className="text-xs text-gray-400 font-semibold mb-2">Quick Actions</p>
                    <div className="flex space-x-2">
                      <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                        <Heart className="w-4 h-4" />
                      </button>
                      <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                        <Star className="w-4 h-4" />
                      </button>
                      <button className="bg-gray-800 hover:bg-gray-700 p-2 rounded-lg transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreziaDashboard;