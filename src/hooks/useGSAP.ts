"use client";

import { useLayoutEffect, useEffect } from 'react';
import gsap from 'gsap';

// Use useLayoutEffect if in browser, otherwise useEffect
const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const useGSAP = (callback: () => void, deps: any[] = []) => {
  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(callback);
    return () => ctx.revert();
  }, deps);
};
