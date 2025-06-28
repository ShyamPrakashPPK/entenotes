'use client';

import Link from 'next/link';
import Image from 'next/image';
import BackgroundGradient from '@/components/ui/BackgroundGradient';
import MainNav from '@/components/nav/MainNav';

export default function HomePage() {
  return (
    <div className="">
      <BackgroundGradient />
      <div className=' bg-gradient-to-bl from-red-500 to-gray-800 p-10 md:p-20 rounded-3xl   transition duration-300 ease-in-out hover:scale-105 flex flex-col items-center  justify-center m-16  text-center'>
        <h1 className='text-white text-5xl md:text-7xl font-black '>ente notes</h1>
        <h3 className='text-gray-300 text-lg md:text-2xl mb-3 '>Keep your notes safe and secure with ente notes</h3>
        <button className='bg-black rounded-xl transition duration-300 ease-in-out hover:scale-110 text-white px-10 py-2 mt-3'>
          <Link href="/register">Go to notes</Link>
        </button>
      </div>
    
    </div>
  );
}
