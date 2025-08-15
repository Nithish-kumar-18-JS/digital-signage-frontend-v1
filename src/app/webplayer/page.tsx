'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function WebPlayer() {
  const [registrationCode, setRegistrationCode] = useState('');

  const generateRegistrationCode = () => {
    const part1 = Math.floor(Math.random() * 9) + 1;
    const fourDigits = () =>
      Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    setRegistrationCode(`${part1}-${fourDigits()}-${fourDigits()}`);
  };

  useEffect(() => {
    generateRegistrationCode();
  }, []);

  return (
    <div className="h-screen w-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left Section */}
      <div className="bg-black text-white p-8 flex flex-col justify-center space-y-8">
        
        {/* Registration Code */}
        <div>
          <h1 className="text-3xl font-bold uppercase">Registration Code</h1>
          <p className="text-teal-500 text-6xl font-bold mt-2">
            {registrationCode}
          </p>
          <p className="mt-2 text-lg">
            Register this screen at:{" "}
            <span className="text-teal-400">app.yourdomain.com</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Registration Steps */}
          <div>
            <h2 className="uppercase font-semibold text-gray-400 mb-3">
              Registration Steps:
            </h2>
            {[
              'Login to your account.',
              'Go to “Screens” and add a new screen or edit an existing one.',
              'Find the Registration Code field and type in the 9-digit code.',
              'Click “Save” and wait for a few seconds.',
            ].map((step, idx) => (
              <div key={idx} className="mb-3">
                <p className="text-teal-500 font-bold">Step {idx + 1}</p>
                <p className="text-white">{step}</p>
              </div>
            ))}
          </div>

          {/* Tech Support Info */}
          <div>
            <h2 className="uppercase font-semibold text-gray-400 mb-3">
              Tech Support Info:
            </h2>
            <p>
              <span className="font-bold">Screen ID:</span> 0dbbbf6723441699
            </p>
            <p>
              <span className="font-bold">Serial #1:</span>{" "}
              <span className="text-teal-400">0dbbbf6723441699</span>
            </p>
            <p>
              <span className="font-bold">Serial #2:</span>{" "}
              <span className="text-teal-400">
                1878dcf8b8d5ef3925904eb0cd97abda
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="relative">
        <Image
          src="/player_bg.png" // Replace with your image
          alt="Background"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
