'use client';

import localFont from 'next/font/local';
import './globals.css';
import { createContext, useEffect, useState } from 'react';
import { Position } from '../types';

export const pretendard = localFont({
  src: '../../public/font/PretendardVariable.woff2',
  variable: '--font-pretendard',
  display: 'swap',
});
export const PositionContext = createContext<any>({
  position: { latitude: 0, longitude: 0 },
  setPosition: () => {},
});
export default function RootLayout({ children }) {
  const [position, setPosition] = useState<Position>({
    latitude: 0,
    longitude: 0,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  }, []);
  return (
    <html lang="ko" className={pretendard.className}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <title>마을엔</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={`flex justify-center bg-dorong-primary-light`}>
        <main className="max-w-[500px] w-full bg-dorong-gray-1 text-center h-screen">
          <PositionContext.Provider value={{ position, setPosition }}>
            {children}
          </PositionContext.Provider>
        </main>
      </body>
    </html>
  );
}
