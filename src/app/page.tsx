'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFireworksPreset } from "tsparticles-preset-fireworks";

export default function Home() {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState("/asgasg.png");
  const [showRandomImage, setShowRandomImage] = useState(false);
  const [imagePosition, setImagePosition] = useState('left'); // 'left' или 'right'

  // Эффект для случайного появления изображения
  useEffect(() => {
    const checkRandom = () => {
      if (Math.random() < 0.05) { // 5% шанс
        setImagePosition(Math.random() < 0.5 ? 'left' : 'right');
        setShowRandomImage(true);
        setTimeout(() => setShowRandomImage(false), 3000); // Скрываем через 3 секунды
      }
    };

    const interval = setInterval(checkRandom, 2000); // Проверяем каждые 2 секунды
    return () => clearInterval(interval);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFireworksPreset(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log("loaded", container);
  }, []);

  useEffect(() => {
    const mirror = mirrorRef.current;
    const container = containerRef.current;

    if (!mirror || !container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const offsetX = (x - rect.width / 2) * 0.1;
      const offsetY = (y - rect.height / 2) * 0.1;

      mirror.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    };

    container.addEventListener('mousemove', handleMouseMove);
    return () => container.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleImageClick = () => {
    setCurrentImage(prev => 
      prev === "/asgasg.png" 
        ? "/634619B2-7B72-43A0-8E29-FFB212BD12BF.png" 
        : "/asgasg.png"
    );
  };

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Случайное изображение */}
      {showRandomImage && (
        <div 
          className={`absolute z-20 w-32 h-32 transition-all duration-[3000ms] ease-in-out
            ${imagePosition === 'left' 
              ? 'animate-slide-left-to-right' 
              : 'animate-slide-right-to-left'}`}
        >
          <Image
            src="/52B2EFF2-0D50-4C4D-9237-25D3C1B04A4A.png"
            alt="Random image"
            width={128}
            height={128}
            className="object-contain"
          />
        </div>
      )}

      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          name: "Fireworks",
          fullScreen: {
            enable: true,
            zIndex: 1
          },
          emitters: [{
            life: {
              count: 0,
              duration: 0.1,
              delay: 0.4
            },
            rate: {
              delay: 0.1,
              quantity: 1
            },
            size: {
              width: 0,
              height: 0
            },
            position: {
              x: 50,
              y: 50
            }
          }],
          particles: {
            number: {
              value: 0
            },
            destroy: {
              mode: "split",
              split: {
                count: 1,
                factor: { value: 1/3 },
                rate: {
                  value: 100
                },
                particles: {
                  stroke: {
                    width: 0
                  },
                  color: {
                    value: ["#FF595E", "#FFCA3A", "#8AC926", "#1982C4", "#6A4C93"]
                  },
                  number: {
                    value: 0
                  },
                  collisions: {
                    enable: false
                  },
                  opacity: {
                    value: 1,
                    animation: {
                      enable: true,
                      speed: 0.7,
                      minimumValue: 0.1,
                      sync: false,
                      startValue: "max",
                      destroy: "min"
                    }
                  },
                  shape: {
                    type: "circle"
                  },
                  size: {
                    value: { min: 2, max: 3 },
                    animation: {
                      enable: false
                    }
                  },
                  life: {
                    count: 1,
                    duration: {
                      value: {
                        min: 1,
                        max: 2
                      }
                    }
                  },
                  move: {
                    enable: true,
                    gravity: {
                      enable: true,
                      acceleration: 9.81,
                      inverse: false
                    },
                    decay: 0.1,
                    speed: {
                      min: 10,
                      max: 25
                    },
                    direction: "random",
                    outModes: "destroy"
                  }
                }
              }
            },
            life: {
              count: 1
            },
            shape: {
              type: "circle"
            },
            size: {
              value: 2,
              animation: {
                enable: false
              }
            },
            move: {
              enable: true,
              gravity: {
                enable: true,
                acceleration: 15,
                inverse: true
              },
              speed: { min: 10, max: 20 },
              direction: "none",
              random: false,
              straight: false,
              outModes: {
                default: "destroy",
                top: "none"
              }
            }
          },
          sounds: {
            enable: false
          }
        }}
      />
      
      <div 
        ref={mirrorRef}
        className="w-96 h-96 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 p-1 transition-transform duration-300 ease-out cursor-pointer z-10"
        onClick={handleImageClick}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden bg-black">
          <Image
            src={currentImage}
            alt="Mirror reflection"
            fill
            className="object-cover opacity-80 transition-opacity duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        </div>
      </div>
    </div>
  );
}
