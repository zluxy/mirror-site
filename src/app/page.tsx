'use client';
import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Particles from "react-tsparticles";
import type { Container, Engine } from "tsparticles-engine";
import { loadFireworksPreset } from "tsparticles-preset-fireworks";
import { motion, AnimatePresence } from "framer-motion";

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// Компонент для звездного неба
const StarryBackground = () => {
  const [stars, setStars] = useState<Array<{
    top: number;
    left: number;
    delay: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    const newStars = Array.from({ length: 50 }).map(() => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.7 + 0.3,
    }));
    setStars(newStars);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-10">
      {stars.map((star, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            animationDelay: `${star.delay}s`,
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
};

export default function Home() {
  const mirrorRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState("/asgasg.png");
  const [showRandomImage, setShowRandomImage] = useState(false);
  const [imagePosition, setImagePosition] = useState('left');
  const [keySequence, setKeySequence] = useState("");
  const [showSecretImage, setShowSecretImage] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [isPulsing, setIsPulsing] = useState(false);

  // Эффект для случайного появления изображения
  useEffect(() => {
    const checkRandom = () => {
      if (Math.random() < 0.05) { // 5% шанс
        setImagePosition(Math.random() < 0.5 ? 'left' : 'right');
        setShowRandomImage(true);
        setTimeout(() => setShowRandomImage(false), 6000);
      }
    };

    const interval = setInterval(checkRandom, 2000);
    return () => clearInterval(interval);
  }, []);

  // Обработчик нажатий клавиш
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSequence = (prev + e.key).toLowerCase().slice(-6);
        if (newSequence.slice(-4) === "edit") {
          setShowVideo(true);
        }
        if (newSequence.slice(-4) === "back") {
          setShowVideo(false);
        }
        if (newSequence === "asiman") {
          setShowSecretImage(true);
          setTimeout(() => setShowSecretImage(false), 3000);
        }
        return newSequence;
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFireworksPreset(engine);
  }, []);

  const particlesLoaded = useCallback(async (container: Container | undefined) => {
    console.log(container);
  }, []);

  const handleImageClick = () => {
    setCurrentImage(prev => 
      prev === "/asgasg.png" 
        ? "/634619B2-7B72-43A0-8E29-FFB212BD12BF.png" 
        : "/asgasg.png"
    );
  };

  // Эффект для уменьшения громкости всего сайта
  useEffect(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0.1; // 10% громкости

    // Подключаем все аудио элементы через gainNode
    const connectAudioElement = (element: HTMLMediaElement) => {
      const source = audioContext.createMediaElementSource(element);
      source.connect(gainNode);
      gainNode.connect(audioContext.destination);
    };

    // Находим все аудио и видео элементы и подключаем их
    const mediaElements = document.querySelectorAll('audio, video, iframe');
    mediaElements.forEach(element => {
      if (element instanceof HTMLMediaElement) {
        connectAudioElement(element);
      }
    });

    // Наблюдаем за новыми аудио/видео элементами
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node instanceof HTMLMediaElement) {
            connectAudioElement(node);
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      audioContext.close();
    };
  }, []);

  // Добавляем эффект пульсации для зеркала
  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 1000);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="relative min-h-screen bg-black overflow-hidden flex items-center justify-center"
    >
      {/* Фоновый градиент */}
      <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-black to-black animate-pulse-slow z-0" />
      
      {/* Звездное небо */}
      <StarryBackground />

      {showVideo ? (
        <div className="fixed inset-0 w-full h-screen z-50 bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/Rl6RUkIvhf8?autoplay=1&controls=0&showinfo=0&rel=0&mute=0&volume=10"
            title="YouTube video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </div>
      ) : (
        <>
          {/* Случайное изображение */}
          {showRandomImage && (
            <div 
              className={`absolute z-20 w-64 h-64 transition-all duration-[6000ms] ease-in-out
                ${imagePosition === 'left' 
                  ? 'animate-slide-left-to-right' 
                  : 'animate-slide-right-to-left'}`}
            >
              <Image
                src="/52B2EFF2-0D50-4C4D-9237-25D3C1B04A4A.png"
                alt="Random image"
                width={256}
                height={256}
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
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                       w-96 h-96 rounded-full overflow-hidden bg-gradient-to-br from-gray-700 to-gray-900 
                       transition-all duration-300 ease-out cursor-pointer z-[999]"
            onClick={handleImageClick}
          >
            <div className="relative w-full h-full">
              <Image
                src={currentImage}
                alt="Mirror reflection"
                fill
                priority
                sizes="384px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Секретное изображение */}
          <AnimatePresence>
            {showSecretImage && (
              <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 260,
                  damping: 20
                }}
                className="absolute z-30 w-96 h-96 flex items-center justify-center"
              >
                <div className="relative w-full h-full rounded-xl overflow-hidden 
                              bg-gradient-to-br from-black/50 to-black/10 
                              backdrop-blur-sm border border-white/10 
                              shadow-xl hover:scale-105 transition-transform">
                  <Image
                    src="/image100.png"
                    alt="Secret image"
                    fill
                    className="object-contain p-4"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
