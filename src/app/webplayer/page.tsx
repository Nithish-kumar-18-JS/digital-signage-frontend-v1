'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { io } from 'socket.io-client';
import { cn, getCookies, setCookie } from '@/lib/utils';
import { Screen } from '@/types';
import { AnimatePresence, motion } from 'framer-motion';

export default function WebPlayer() {
  const [registrationCode, setRegistrationCode] = useState('');
  const [screenData, setScreenData] = useState<Screen | null>(null);
  const [cachedMedia, setCachedMedia] = useState<Record<string, string>>({});
  const [index, setIndex] = useState(0);

  const generateRegistrationCode = () => {
    const part1 = Math.floor(Math.random() * 9) + 1;
    const fourDigits = () =>
      Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${part1}-${fourDigits()}-${fourDigits()}`;
  };

  // Load registration code from cookies or generate new
  useEffect(() => {
    let code = getCookies('registrationCode');
    if (!code) {
      code = generateRegistrationCode();
      setCookie('registrationCode', code);
    }
    setRegistrationCode(code);
  }, []);

  // Restore cached screenData & blobs on startup
  useEffect(() => {
    const cached = localStorage.getItem('screenData');
    if (cached) {
      try {
        const parsed: Screen = JSON.parse(cached);
        setScreenData(parsed);
        console.log('📦 Loaded screenData from localStorage');
        restoreCachedMedia(parsed);
      } catch (err) {
        console.error('❌ Failed to parse cached screenData:', err);
      }
    }
  }, []);

  // WebSocket connection AFTER code is set
  useEffect(() => {
    if (!registrationCode) return;

    const socket = io(process.env.NEXT_PUBLIC_WEB_SOCKET_API_BASE_URL, {
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Connected to WebSocket');
      socket.emit('message', { text: registrationCode }, (response: any) => {
        console.log('Server response:', response);
      });
    });

    socket.on('screenUpdated', async (data: any) => {
      try {
        const parsedData: any = JSON.parse(data);
        if (parsedData?.deviceId === registrationCode) {
          setScreenData(parsedData);
          localStorage.setItem('screenData', JSON.stringify(parsedData));

          if (parsedData.screenUpdate) {
            await caches.delete('screen-content-cache');
            window.location.reload();
          }

          const screenContentData = parsedData?.playlist?.items?.map(
            (item: any) => item.media?.url
          );

          if (screenContentData?.length) {
            const cache = await caches.open('screen-content-cache');

            for (const item of screenContentData) {
              const fileName = item.split('/').pop() || item;
              const cacheKey = `/cache/${fileName}`;

              const existing = await cache.match(new Request(cacheKey));
              if (existing) {
                console.log(`📂 Already cached: ${cacheKey}`);
                const blob = await existing.blob();
                const objectUrl = URL.createObjectURL(blob);
                setCachedMedia((prev) => ({ ...prev, [item]: objectUrl }));
                continue;
              }

              try {
                const response = await fetch(item);
                const blob = await response.blob();
                await cache.put(new Request(cacheKey), new Response(blob));

                const objectUrl = URL.createObjectURL(blob);
                setCachedMedia((prev) => ({ ...prev, [item]: objectUrl }));

                console.log(`✅ Cached new blob: ${cacheKey}`);
              } catch (err) {
                console.error(`❌ Error caching ${item}:`, err);
              }
            }

            const keys = await cache.keys();
            console.log(
              '🔑 Cache keys now:',
              keys.map((k) => k.url)
            );
          }
        }
      } catch (error) {
        console.error('❌ Error handling screenUpdated:', error);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [registrationCode]);

  // Helper: Restore blobs from cache on reload
  const restoreCachedMedia = async (parsed: Screen) => {
    try {
      const cache = await caches.open('screen-content-cache');
      const screenContentData = parsed?.playlist?.items?.map(
        (item: any) => item.media?.url
      );

      if (screenContentData?.length) {
        for (const item of screenContentData) {
          const fileName = item.split('/').pop() || item;
          const cacheKey = `/cache/${fileName}`;
          const match = await cache.match(new Request(cacheKey));

          if (match) {
            const blob = await match.blob();
            const objectUrl = URL.createObjectURL(blob);
            setCachedMedia((prev) => ({ ...prev, [item]: objectUrl }));
            console.log(`📂 Restored ${cacheKey} from cache`);
          }
        }
      }
    } catch (err) {
      console.error('❌ Failed to restore cached media:', err);
    }
  };

  // Slideshow effect
  useEffect(() => {
    if (!screenData?.playlist?.items?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) =>
        prev + 1 === screenData?.playlist?.items?.length ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [screenData?.playlist?.items?.length]);

  const current =
    screenData?.playlist?.items?.[index] ?? null;

    return (
      <div
        className={cn(
          'h-screen w-screen grid grid-cols-1',
          !screenData?.playlist?.items?.length && 'md:grid-cols-2'
        )}
      >
        {/* Playlist rendering */}
        {screenData?.playlist?.items?.length && current && (
          <div className="w-full h-full relative bg-black">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={cachedMedia[current?.media?.url || ''] || current?.media?.url || ''}
                alt={current?.media?.name || ''}
                className="absolute inset-0 w-full h-full object-contain md:object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.2 }}
              />
            </AnimatePresence>
          </div>
        )}
    
        {/* Registration UI */}
        {!screenData?.playlist?.items?.length && (
          <div className="bg-black text-white p-6 sm:p-8 flex flex-col justify-center space-y-6 md:space-y-8 overflow-y-auto">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold uppercase">Registration Code</h1>
              <p className="text-teal-500 text-4xl sm:text-6xl font-bold mt-2 break-words">
                {registrationCode}
              </p>
              <p className="mt-2 text-base sm:text-lg">
                Register this screen at:{' '}
                <span className="text-teal-400 break-all">app.yourdomain.com</span>
              </p>
            </div>
    
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Registration Steps */}
              <div>
                <h2 className="uppercase font-semibold text-gray-400 mb-3 text-sm sm:text-base">
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
                    <p className="text-white text-sm sm:text-base">{step}</p>
                  </div>
                ))}
              </div>
    
              {/* Tech Support Info */}
              <div>
                <h2 className="uppercase font-semibold text-gray-400 mb-3 text-sm sm:text-base">
                  Tech Support Info:
                </h2>
                <p className="text-sm sm:text-base">
                  <span className="font-bold">Screen ID:</span> 0dbbbf6723441699
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-bold">Serial #1:</span>{' '}
                  <span className="text-teal-400">0dbbbf6723441699</span>
                </p>
                <p className="text-sm sm:text-base">
                  <span className="font-bold">Serial #2:</span>{' '}
                  <span className="text-teal-400">
                    1878dcf8b8d5ef3925904eb0cd97abda
                  </span>
                </p>
              </div>
            </div>
          </div>
        )}
    
        {/* Background image when waiting */}
        {!screenData?.playlist?.items?.length && (
          <div className="relative hidden md:block">
            <Image
              src="/player_bg.png"
              alt="Background"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center text-white bg-black/70">
              Waiting for screen data...
            </div>
          </div>
        )}
      </div>
    );    
}
