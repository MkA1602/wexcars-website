"use client"

import React, { useRef } from "react"
import { Car, Users, Shield, Clock } from "lucide-react"
import { motion, useInView } from "framer-motion"
import VariableProximity from "@/components/ui/variable-proximity"

interface StatsCardsProps {
  title?: string
  description?: string
  stats: Array<{
    value: string
    label: string
    description?: string
    icon: string
  }>
}

const iconMap = {
  Car: Car,
  Users: Users,
  Shield: Shield,
  Clock: Clock,
}

export function StatsCards({
  title = "Key Metrics",
  description = "Track your success with these important numbers",
  stats,
}: StatsCardsProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const containerRef = useRef<HTMLDivElement>(null!)

  return (
    <section className="py-10">
      <div className="mx-auto max-w-7xl">
        {title && (
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
          >
            <h2 className="text-gray-900 mb-4 text-3xl font-bold lg:text-4xl">
              <VariableProximity
                label={title}
                fromFontVariationSettings="'wght' 700, 'slnt' 0"
                toFontVariationSettings="'wght' 900, 'slnt' -5"
                containerRef={containerRef}
                radius={60}
                falloff="gaussian"
                className="text-gray-900"
              />
            </h2>
            <p className="text-gray-600 mx-auto max-w-2xl text-lg">
              <VariableProximity
                label={description}
                fromFontVariationSettings="'wght' 400, 'slnt' 0"
                toFontVariationSettings="'wght' 600, 'slnt' -2"
                containerRef={containerRef}
                radius={50}
                falloff="linear"
                className="text-gray-600"
              />
            </p>
          </motion.div>
        )}

        <div
          ref={ref}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30, scale: 0.9 }}
              animate={
                isInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 30, scale: 0.9 }
              }
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                type: "spring",
                stiffness: 100,
              }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-white/50 p-6 transition-all hover:scale-105 hover:border-primary-light hover:shadow-xl"
            >
              {/* Icon */}
              <motion.div
                className="mb-4 text-primary-light"
                initial={{ rotate: -10, scale: 0.8 }}
                animate={
                  isInView
                    ? { rotate: 0, scale: 1 }
                    : { rotate: -10, scale: 0.8 }
                }
                transition={{
                  duration: 0.6,
                  delay: index * 0.1 + 0.2,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {React.createElement(
                  iconMap[stat.icon as keyof typeof iconMap] || Car,
                  {
                    className: "h-8 w-8",
                  }
                )}
              </motion.div>

              {/* Value */}
              <motion.div
                className="text-gray-900 mb-1 text-2xl font-bold lg:text-3xl"
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : { scale: 0.5 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.1 + 0.3,
                  type: "spring",
                  stiffness: 200,
                }}
              >
                {stat.value}
              </motion.div>

              {/* Label */}
              <h3 className="text-gray-900 mb-2 text-sm font-semibold tracking-wide">
                {stat.label}
              </h3>

              {/* Description */}
              {stat.description && (
                <p className="text-gray-600 text-xs">
                  {stat.description}
                </p>
              )}

              {/* Hover effect background */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-primary-light/10 via-transparent to-transparent opacity-0 group-hover:opacity-100"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

