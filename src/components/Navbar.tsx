import { UserCircle } from 'lucide-react';
import React from 'react';

function Navbar() {
  return (
    <header className='fixed inset-x-0 top-0 bg-white h-14 border-b border-border flex items-center p-6 justify-between z-[2]'>
      <nav className='flex items-center justify-between w-full'>
        <h1 className='bg-gradient-to-r from-[#3D30E7]  to-[#5247e8] inline-block text-transparent bg-clip-text text-xl font-bold'>
          Zasta
        </h1>
        <div className='flex items-center gap-4'>
          <a href='#' className='text-gray-500'>
            Customers
          </a>
          <a href='#'>Invoices</a>
          <a href='#' className='text-gray-500'>
            Settings
          </a>
          <UserCircle className='size-8 bg-gray-100 rounded-full cursor-pointer p-2 md:ml-8' />
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
