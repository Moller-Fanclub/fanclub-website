import React from 'react';
import NavigationBar from '../../components/NavigationBar';

const ComingSoonPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-[#FFFAF0]">
            <NavigationBar />
            <div className="mx-auto max-w-4xl px-4 py-24">
                <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                    <div className="mb-8">
                        <svg
                            className="mx-auto h-32 w-32 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                    
                    <h1 className="mb-4 text-5xl font-bold text-gray-800">
                        Kommer snart
                    </h1>
                    
                    <p className="mb-8 max-w-2xl text-xl text-gray-600">
                        Vi jobber med noe spennende! Merch-butikken vår vil være tilgjengelig snart.
                    </p>
                    
                    <div className="rounded-xl bg-white p-8 shadow-lg">
                        <p className="mb-6 text-lg text-gray-700">
                            Hold deg oppdatert ved å følge oss på Instagram!
                        </p>
                        
                        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
                            <a
                                href="https://www.instagram.com/mollerfan.club"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 px-6 py-3 text-white font-semibold transition-transform hover:scale-105 hover:shadow-lg"
                            >
                                <svg 
                                    className="h-6 w-6" 
                                    fill="currentColor" 
                                    viewBox="0 0 24 24"
                                >
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                </svg>
                                @mollerfan.club
                            </a>
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComingSoonPage;
