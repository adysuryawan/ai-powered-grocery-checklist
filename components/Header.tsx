import React from 'react';

const Header = () => {
  return (
    <header className="text-center p-6 md:p-8 border-b border-gray-200 bg-white">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">
        Intelligent Grocery Checklist
      </h1>
      <p className="mt-3 text-md md:text-lg text-gray-600 max-w-2xl mx-auto">
        Describe your weekly meals or paste your notes. Our AI will create a perfectly organized grocery list for you.
      </p>
    </header>
  );
};

export default Header;
