"use client";

import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line,
} from "react-simple-maps";
import { motion } from "framer-motion";

const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Dot {
  start: { lat: number; lng: number };
  end: { lat: number; lng: number };
}

interface WorldMapProps {
  dots?: Dot[];
}

export default function WorldMap({ dots = [] }: WorldMapProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 1 ? 0 : prev + 0.01));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full h-[600px] relative">
      <ComposableMap
        projectionConfig={{
          scale: 147,
          center: [0, 20],
        }}
        className="w-full h-full"
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="#2a2a2a"
                stroke="#3a3a3a"
                strokeWidth={0.5}
                style={{
                  default: { outline: "none" },
                  hover: { outline: "none", fill: "#3a3a3a" },
                  pressed: { outline: "none" },
                }}
              />
            ))
          }
        </Geographies>

        {dots.map((dot, index) => {
          const startX = dot.start.lng;
          const startY = dot.start.lat;
          const endX = dot.end.lng;
          const endY = dot.end.lat;

          // Calculate current position of animated dot
          const currentX = startX + (endX - startX) * progress;
          const currentY = startY + (endY - startY) * progress;

          return (
            <g key={index}>
              {/* Connection line */}
              <Line
                from={[startX, startY]}
                to={[endX, endY]}
                stroke="#b22222"
                strokeWidth={1.5}
                strokeOpacity={0.4}
              />
              {/* Start marker */}
              <Marker coordinates={[startX, startY]}>
                <circle r={4} fill="#b22222" />
              </Marker>
              {/* End marker */}
              <Marker coordinates={[endX, endY]}>
                <circle r={4} fill="#8b0000" />
              </Marker>
              {/* Animated dot */}
              <Marker coordinates={[currentX, currentY]}>
                <motion.circle
                  r={5}
                  fill="#b22222"
                  initial={{ scale: 0 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              </Marker>
            </g>
          );
        })}
      </ComposableMap>
    </div>
  );
}

