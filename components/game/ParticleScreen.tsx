"use client";

import React, { useCallback, useEffect, useState } from "react";
import Particles from "react-tsparticles";
import { Container, Engine } from "tsparticles-engine";
import { loadSlim } from "tsparticles-slim";

export default function ParticleScreen() {
  const [height, setHeight] = useState<number>(0);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const particlesLoaded = useCallback(
    async (container: Container | undefined) => {
      console.log(container);
    },
    [],
  );

  useEffect(() => {
    const updateHeight = () => setHeight(document.body.scrollHeight);
    updateHeight(); // initial set

    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  return (
    <div
      className="absolute top-0 left-0 w-full pointer-events-none z-0"
      style={{ height }}
    >
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          fpsLimit: 120,
          interactivity: {
            events: {
              onHover: {
                enable: true,
                mode: "attract",
              },
              resize: true,
            },
            modes: {
              push: { quantity: 4 },
              repulse: { distance: 50, duration: 3 },
            },
          },
          particles: {
            color: { value: "#ff8c00" },
            links: { enable: false },
            move: {
              direction: "none",
              enable: true,
              outModes: { default: "out" },
              random: true,
              speed: 1,
              straight: false,
              gravity: { enable: true, acceleration: 0.1 },
            },
            number: {
              density: { enable: true, area: 1500 },
              value: 80,
            },
            opacity: {
              value: 0.3,
              random: { enable: true, minimumValue: 0.1 },
              animation: {
                enable: true,
                speed: 1,
                minimumValue: 0.1,
                sync: false,
              },
            },
            shape: { type: "circle" },
            size: {
              value: { min: 1, max: 10 },
              animation: {
                enable: true,
                speed: 2,
                minimumValue: 0.5,
                sync: false,
              },
            },
          },
          detectRetina: true,
        }}
      />
    </div>
  );
}
