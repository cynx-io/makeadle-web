import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

interface ConfettiProps {
  trigger: boolean;
  cardRef?: React.RefObject<HTMLDivElement | null>;
  onComplete?: () => void;
}

export default function Confetti({
  trigger,
  cardRef,
  onComplete,
}: ConfettiProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [cardPosition, setCardPosition] = useState({ x: 50, y: 50 });

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      if (container) {
        // Auto-hide confetti after 4 seconds
        setTimeout(() => {
          setShowConfetti(false);
          onComplete?.();
        }, 4000);
      }
    },
    [onComplete],
  );

  useEffect(() => {
    console.log("Confetti useEffect triggered:", {
      trigger,
      cardRef: cardRef?.current,
    });
    if (trigger && cardRef?.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const centerX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
      const centerY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

      console.log("Card position:", { centerX, centerY, rect });
      setCardPosition({ x: centerX, y: centerY });
      setShowConfetti(true);
    }
  }, [trigger, cardRef]);

  if (!showConfetti) {
    console.log("Confetti not showing:", { showConfetti, trigger });
    return null;
  }

  console.log("Rendering confetti with position:", cardPosition);

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <Particles
        id="confetti-particles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          particles: {
            color: {
              value: [
                "#ff6b6b",
                "#4ecdc4",
                "#45b7d1",
                "#f9ca24",
                "#f0932b",
                "#eb4d4b",
                "#6c5ce7",
                "#a29bfe",
                "#00d2d3",
                "#ff9ff3",
              ],
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "out",
              },
              random: true,
              speed: { min: 3, max: 10 },
              straight: false,
              gravity: {
                enable: true,
                acceleration: 6,
              },
            },
            number: {
              value: 0,
            },
            opacity: {
              value: 1,
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0,
                sync: false,
              },
            },
            rotate: {
              value: {
                min: 0,
                max: 360,
              },
              direction: "random",
              animation: {
                enable: true,
                speed: 60,
              },
            },
            tilt: {
              direction: "random",
              enable: true,
              value: {
                min: 0,
                max: 360,
              },
              animation: {
                enable: true,
                speed: 60,
              },
            },
            shape: {
              type: ["square", "circle", "triangle", "polygon"],
              options: {
                polygon: {
                  nb_sides: 6,
                },
              },
            },
            size: {
              value: { min: 4, max: 14 },
              animation: {
                enable: true,
                speed: 8,
                minimumValue: 0,
                sync: false,
              },
            },
            roll: {
              darken: {
                enable: true,
                value: 30,
              },
              enable: true,
              speed: {
                min: 10,
                max: 20,
              },
            },
            wobble: {
              distance: 30,
              enable: true,
              speed: {
                min: -15,
                max: 15,
              },
            },
          },
          detectRetina: true,
          emitters: {
            direction: "none",
            life: {
              count: 1,
              duration: 0.15,
              delay: 0.1,
            },
            rate: {
              delay: 0.005,
              quantity: 20,
            },
            size: {
              width: 80,
              height: 80,
            },
            position: {
              x: cardPosition.x,
              y: cardPosition.y,
            },
          },
        }}
      />
    </div>
  );
}
