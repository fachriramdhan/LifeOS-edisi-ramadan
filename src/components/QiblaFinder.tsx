import React, { useState, useEffect, useCallback } from 'react';
import { Compass, Navigation, RotateCw } from 'lucide-react';
import { motion } from 'framer-motion';

const QiblaFinder = () => {
  const [heading, setHeading] = useState<number>(0);
  const [qibla, setQibla] = useState<number>(0);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isAligned, setIsAligned] = useState(false);

  // Mecca Coordinates
  const MECCA_LAT = 21.4225;
  const MECCA_LONG = 39.8262;

  const calculateQibla = useCallback((latitude: number, longitude: number) => {
    const phiK = (MECCA_LAT * Math.PI) / 180.0;
    const lambdaK = (MECCA_LONG * Math.PI) / 180.0;
    const phi = (latitude * Math.PI) / 180.0;
    const lambda = (longitude * Math.PI) / 180.0;

    const psi =
      (180.0 / Math.PI) *
      Math.atan2(
        Math.sin(lambdaK - lambda),
        Math.cos(phi) * Math.tan(phiK) - Math.sin(phi) * Math.cos(lambdaK - lambda)
      );

    setQibla(Math.round(psi));
  }, []);

  useEffect(() => {
    // Get User Location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          calculateQibla(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          setLocationError('Location access denied. Using default (Jakarta).');
          setQibla(295); // Default to Jakarta
        }
      );
    } else {
      setLocationError('Geolocation not supported.');
      setQibla(295);
    }
  }, [calculateQibla]);

  const handleOrientation = useCallback((e: DeviceOrientationEvent) => {
    let compass = 0;
    
    // iOS
    if ((e as any).webkitCompassHeading) {
      compass = (e as any).webkitCompassHeading;
    } 
    // Android (standard)
    else if (e.alpha !== null) {
      compass = Math.abs(e.alpha - 360);
    }

    setHeading(compass);
  }, []);

  const requestAccess = () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      (DeviceOrientationEvent as any).requestPermission()
        .then((permissionState: string) => {
          if (permissionState === 'granted') {
            setPermissionGranted(true);
            window.addEventListener('deviceorientation', handleOrientation);
          } else {
            alert('Permission denied');
          }
        })
        .catch(console.error);
    } else {
      // Non-iOS 13+ devices
      setPermissionGranted(true);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  };

  useEffect(() => {
    // Check alignment (within 5 degrees)
    const diff = Math.abs(heading - qibla);
    const aligned = diff < 5 || diff > 355;
    
    if (aligned && !isAligned) {
      // Haptic feedback if available
      if (navigator.vibrate) navigator.vibrate(50);
    }
    setIsAligned(aligned);
  }, [heading, qibla, isAligned]);

  // Calculate rotation for the compass needle (points to Qibla)
  // We want the needle to point to Qibla relative to North (0)
  // If phone points North (0), needle should point to Qibla (e.g. 295)
  // If phone points East (90), needle should point to Qibla - 90 (205)
  const needleRotation = qibla - heading;

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-lg border border-gray-100 dark:border-gray-800 text-center relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">
            <Compass className="w-4 h-4" />
          </div>
          <div className="text-left">
            <h3 className="font-bold text-lg dark:text-white font-display">Pencari Kiblat</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {qibla}° dari Utara
            </p>
          </div>
        </div>
        {locationError && (
           <div className="text-[10px] text-red-500 bg-red-50 px-2 py-1 rounded-lg max-w-[100px] leading-tight">
             {locationError}
           </div>
        )}
      </div>

      {!permissionGranted ? (
        <div className="py-8">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <RotateCw className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-sm text-gray-500 mb-6 px-4">
            Kami memerlukan akses kompas perangkatmu untuk menunjukkan arah Kiblat secara akurat.
          </p>
          <button 
            onClick={requestAccess}
            className="w-full bg-black dark:bg-white text-white dark:text-black py-3 rounded-xl font-bold shadow-lg active:scale-95 transition-transform"
          >
            Aktifkan Kompas
          </button>
        </div>
      ) : (
        <div className="relative py-4">
          {/* Compass Circle */}
          <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
            {/* Outer Ring */}
            <div className={`absolute inset-0 rounded-full border-4 transition-colors duration-500 ${isAligned ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'border-gray-200 dark:border-gray-700'}`}></div>
            
            {/* North Indicator (Static relative to phone) - Actually, usually compass rotates, needle stays? 
                Let's rotate the whole compass dial so North points to actual North. 
            */}
            <motion.div 
              className="absolute w-full h-full"
              animate={{ rotate: -heading }}
              transition={{ type: "spring", stiffness: 50, damping: 20 }}
            >
              {/* Dial Markings */}
              {[0, 90, 180, 270].map((deg) => (
                <div 
                  key={deg} 
                  className="absolute top-0 left-1/2 -translate-x-1/2 h-full flex flex-col justify-between py-2"
                  style={{ transform: `rotate(${deg}deg)` }}
                >
                  <div className={`text-xs font-bold ${deg === 0 ? 'text-red-500' : 'text-gray-400'}`}>
                    {deg === 0 ? 'U' : deg === 90 ? 'T' : deg === 180 ? 'S' : 'B'}
                  </div>
                  <div className="w-0.5 h-2 bg-gray-300 dark:bg-gray-600"></div>
                </div>
              ))}

              {/* Qibla Indicator on the Dial */}
              <div 
                className="absolute top-0 left-1/2 -translate-x-1/2 h-1/2 origin-bottom flex flex-col items-center pt-8"
                style={{ transform: `rotate(${qibla}deg)` }}
              >
                 <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                 </div>
                 <div className="w-0.5 h-full bg-emerald-500/50"></div>
              </div>
            </motion.div>

            {/* Center Phone/User Indicator */}
            <div className="absolute w-20 h-20 bg-white dark:bg-gray-800 rounded-full shadow-xl flex items-center justify-center z-20 border border-gray-100 dark:border-gray-700">
               <Navigation className={`w-8 h-8 ${isAligned ? 'text-emerald-500 fill-emerald-500' : 'text-gray-400'} transition-colors duration-300`} />
            </div>
          </div>

          <div className="mt-6 text-center">
            {isAligned ? (
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-bold animate-bounce">
                Kamu menghadap Kiblat!
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Putar ponselmu sampai <span className="text-emerald-500 font-bold">Titik Hijau</span> sejajar dengan bagian atas.
              </p>
            )}
          </div>
          
          <p className="text-[10px] text-gray-400 mt-4">
            Tips: Gerakkan ponsel membentuk angka 8 untuk kalibrasi.
          </p>
        </div>
      )}
    </div>
  );
};

export default QiblaFinder;
