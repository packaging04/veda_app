import React from 'react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-[#1a2332]/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-4xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 text-[#f5f1e8]/60 hover:text-[#f5f1e8] transition-colors"
        >
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Video Container */}
        <div className="relative bg-[#1a2332] rounded-lg overflow-hidden shadow-2xl">
          <div className="aspect-video flex items-center justify-center">
            {/* Placeholder for video - in production this would be an actual video player */}
            <div className="text-center p-12">
              <div className="w-24 h-24 bg-[#d4af37]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-[#d4af37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-serif text-[#f5f1e8] mb-4">
                How Veda Preserves Wisdom
              </h3>
              <p className="text-[#f5f1e8]/60 max-w-md mx-auto mb-8">
                Watch how families are using Veda to capture their loved ones' stories, 
                wisdom, and life philosophy for future generations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-6 py-3 bg-[#d4af37] text-[#1a2332] font-medium rounded-sm hover:bg-[#e5c55a] transition-colors">
                  Play Demo Video
                </button>
                <button 
                  onClick={onClose}
                  className="px-6 py-3 border border-[#d4af37]/50 text-[#f5f1e8] font-medium rounded-sm hover:border-[#d4af37] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="mt-4 text-center">
          <p className="text-[#f5f1e8]/40 text-sm">
            Duration: 3:45 • Learn about the Veda experience
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
