import React from 'react';
import { Icons } from './index';

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 flex flex-col items-center justify-center animate-fade-in">
      <div className="flex items-center space-x-3">
        <Icons.Cloud className="w-8 h-8 text-gold-500" />
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gold-300 via-gold-500 to-gold-300 tracking-tight">
          재경 날씨 알림 웹
        </h1>
      </div>
      <p className="text-gold-200/60 text-sm mt-1 tracking-widest uppercase">Hello!</p>
    </header>
  );
};

export default Header;

