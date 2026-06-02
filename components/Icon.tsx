import { CSSProperties } from 'react';

interface IconProps {
  name: string;
  size?: number;
  sw?: number;
  style?: CSSProperties;
  className?: string;
}

export function Icon({ name, size = 20, sw = 1.8, style, className }: IconProps) {
  const p = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: sw,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    style,
    className,
  };

  const paths: Record<string, React.ReactNode> = {
    arrow:    <path d="M5 12h14M13 6l6 6-6 6" />,
    arrowL:   <path d="M19 12H5M11 18l-6-6 6-6" />,
    check:    <path d="M20 6L9 17l-5-5" />,
    star:     <path d="M12 3l2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8L6.6 19.6l1-6L3.3 9.4l6-.9L12 3z" fill="currentColor" stroke="none" />,
    spark:    <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M6 18l2-2M16 8l2-2" />,
    close:    <path d="M6 6l12 12M18 6L6 18" />,
    menu:     <path d="M4 7h16M4 12h16M4 17h16" />,
    home:     <path d="M4 11l8-7 8 7M6 10v9h12v-9" />,
    building: <path d="M5 21V4a1 1 0 011-1h8a1 1 0 011 1v17M15 9h3a1 1 0 011 1v11M8 7h3M8 11h3M8 15h3" />,
    sparkle:  <path d="M12 2l1.8 5.6L19.5 9l-5.7 1.4L12 16l-1.8-5.6L4.5 9l5.7-1.4L12 2z" fill="currentColor" stroke="none" />,
    leaf:     <path d="M4 20c0-9 7-15 16-15 0 9-6 16-16 15zM4 20c4-5 7-7 11-9" />,
    clock:    <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    shield:   <path d="M12 3l7 3v5c0 5-3 8-7 10-4-2-7-5-7-10V6l7-3z" />,
    cal:      <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
    user:     <><circle cx="12" cy="8" r="4" /><path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" /></>,
    fb:       <path d="M14 8h2V5h-2c-2 0-3 1-3 3v2H9v3h2v6h3v-6h2l1-3h-3V8z" fill="currentColor" stroke="none" />,
    ig:       <><rect x="4" y="4" width="16" height="16" rx="5" /><circle cx="12" cy="12" r="3.4" /><circle cx="17" cy="7" r=".8" fill="currentColor" /></>,
    x:        <path d="M5 5l14 14M19 5L5 19" />,
    in:       <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 10v6M8 7v.01M12 16v-3.5a1.8 1.8 0 013.6 0V16" /></>,
    window:   <><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M12 4v16M4 12h16" /></>,
    bed:      <path d="M3 18v-6a2 2 0 012-2h14a2 2 0 012 2v6M3 14h18M6 10V8a1 1 0 011-1h3a1 1 0 011 1v2M12 10V8a1 1 0 011-1h3a1 1 0 011 1v2M3 18v2M21 18v2" />,
    phone:    <path d="M5 4h3l1.5 4-2 1.5a11 11 0 005 5l1.5-2 4 1.5v3a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />,
    mail:     <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M3 7l9 6 9-6" /></>,
    pin:      <><path d="M12 21s-7-6.5-7-11a7 7 0 0114 0c0 4.5-7 11-7 11z" /><circle cx="12" cy="10" r="2.6" /></>,
    cap:      <><path d="M2.5 8.5L12 5l9.5 3.5L12 12 2.5 8.5z" /><path d="M6.5 10.2V15c0 1.1 2.5 2 5.5 2s5.5-.9 5.5-2v-4.8" /><path d="M21.5 8.5v4.2" /></>,
    dumbbell: <><path d="M6.5 6v12M3.5 8.5v7M17.5 6v12M20.5 8.5v7M6.5 12h11" /></>,
  };

  return <svg {...p}>{paths[name] || null}</svg>;
}
