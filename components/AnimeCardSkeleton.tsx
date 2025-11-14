import React from 'react';

const AnimeCardSkeleton: React.FC = () => {
    return (
        <div className="rounded-lg overflow-hidden bg-slate-800">
            <div className="relative w-full aspect-[2/3] bg-slate-700 animate-pulse">
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-600/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
            </div>
            <style>
                {`
                    @keyframes shimmer {
                        100% {
                            transform: translateX(100%);
                        }
                    }
                `}
            </style>
        </div>
    );
};

export default AnimeCardSkeleton;
