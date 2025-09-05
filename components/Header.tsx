import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
         <img 
          src="https://www.ineco.com/ineco/sites/default/files/2022-12/Logo%20Ineco.jpg" 
          alt="Ineco Logo"
          className="h-8"
        />
        <h1 className="text-xl font-semibold text-[#1A4488]">
          Viajes en Cabina
        </h1>
      </div>
    </header>
  );
};

export default Header;