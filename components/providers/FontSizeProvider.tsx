"use client"
import React, { createContext, useState, useContext, useEffect } from 'react';

interface FontSizeContextType {
    fontSize: string;
    changeFontSize: (size: string) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(undefined);

export const FontSizeProvider = ({ children }: {
    children: React.ReactNode;
}) => {
    const [fontSize, setFontSize] = useState<string>('16px');

    useEffect(() => {
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize) {
            setFontSize(savedFontSize);
        }
    }, []);

    const changeFontSize = (size: string) => {
        setFontSize(size);
        console.log(size);
        localStorage.setItem('fontSize', size);
    };

    return (
        <FontSizeContext.Provider value={{ fontSize, changeFontSize }}>
            {children}
        </FontSizeContext.Provider>
    );
};

export const useFontSize = (): FontSizeContextType => {
    const context = useContext(FontSizeContext);
    if (!context) {
        throw new Error('useFontSize must be used within a FontSizeProvider');
    }
    return context;
};
