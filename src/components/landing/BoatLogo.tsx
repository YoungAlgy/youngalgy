type BoatLogoProps = {
  size?: number;
  className?: string;
};

export function BoatLogo({ size = 28, className }: BoatLogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M5 22 L27 22 L24 26.5 L8 26.5 Z" />
      <line x1="16" y1="22" x2="16" y2="5" />
      <path d="M16 5.5 L24 21 L16 21 Z" />
      <path d="M16 5.5 L19.5 7 L16 8.5" fill="currentColor" />
    </svg>
  );
}
