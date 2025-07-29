import React from 'react';

const Modal = ({ title, children, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[1000] p-4 pointer-events-auto">
            <div className="w-full max-w-2xl bg-stone-800 border-4 border-amber-900 rounded-lg shadow-2xl text-white font-['Lato'] animate-fade-in">
                <header className="p-4 bg-stone-900/50 border-b-2 border-amber-800 flex justify-between items-center">
                    <h2 className="text-2xl text-amber-300">{title}</h2>
                    <button 
                        onClick={onClose}
                        className="w-9 h-9 flex-shrink-0 flex items-center justify-center bg-black/20 border-2 border-amber-900/60 rounded-md text-amber-300/70 hover:text-white hover:bg-red-800/60 transition-colors"
                        aria-label="Close modal"
                        title="Close"
                    >
                       <i className="fas fa-times text-xl"></i>
                    </button>
                </header>
                <main className="p-6 max-h-[60vh] overflow-y-auto">
                    {children}
                </main>
            </div>
             <style>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default Modal;