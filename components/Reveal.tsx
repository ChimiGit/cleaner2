'use client';

import { useEffect, useRef, ElementType, ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  [key: string]: unknown;
}

export function Reveal({ children, className = '', delay = 0, as: Tag = 'div', ...rest }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            el.classList.add('in');
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={'reveal ' + className}
      style={{ transitionDelay: delay + 'ms' }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
