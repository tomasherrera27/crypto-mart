'use client'

import { motion, MotionProps } from 'framer-motion'
import React from 'react'

export function ClientMotionDiv({ children, ...props }: MotionProps) {
  return <motion.div {...props}>{children}</motion.div>
}

// Add other motion components as needed