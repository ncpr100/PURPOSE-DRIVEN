'use client'

/**
 * usePaddle — initializes Paddle Billing JS SDK once and returns the instance.
 *
 * Uses NEXT_PUBLIC_PADDLE_CLIENT_TOKEN for authentication.
 * Reads PADDLE_ENVIRONMENT via NEXT_PUBLIC_PADDLE_ENVIRONMENT (default: sandbox).
 */

import { useEffect, useState } from 'react'
import { initializePaddle, Paddle, Environment } from '@paddle/paddle-js'

let paddlePromise: Promise<Paddle | undefined> | null = null

function getOrInitPaddle(): Promise<Paddle | undefined> {
  if (paddlePromise) return paddlePromise

  const token = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN
  if (!token) {
    console.warn('[Paddle] NEXT_PUBLIC_PADDLE_CLIENT_TOKEN is not set')
    paddlePromise = Promise.resolve(undefined)
    return paddlePromise
  }

  const env =
    process.env.NEXT_PUBLIC_PADDLE_ENVIRONMENT === 'production'
      ? Environment.Production
      : Environment.Sandbox

  paddlePromise = initializePaddle({ environment: env, token })
  return paddlePromise
}

export function usePaddle(): Paddle | undefined {
  const [paddle, setPaddle] = useState<Paddle | undefined>(undefined)

  useEffect(() => {
    getOrInitPaddle().then(instance => {
      if (instance) setPaddle(instance)
    })
  }, [])

  return paddle
}
