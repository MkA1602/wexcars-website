"use client"

import { useEffect, useState } from "react"
import { motion, useSpring, useTransform } from "framer-motion"

interface PriceFlowProps {
  value: number
}

export default function PriceFlow({ value }: PriceFlowProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const spring = useSpring(value, { stiffness: 100, damping: 30 })
  const rounded = useTransform(spring, (latest) => Math.round(latest))

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    const unsubscribe = rounded.on("change", (latest) => {
      setDisplayValue(latest)
    })
    return () => unsubscribe()
  }, [rounded])

  return <motion.span>{displayValue}</motion.span>
}

