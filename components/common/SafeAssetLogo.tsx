"use client";

import { useState } from "react";
import { getSafeImageUrl } from "@/lib/market-data/image-helper";

interface SafeAssetLogoProps {
  src: string | null | undefined;
  symbol: string;
  name: string;
  size?: number;
  className?: string;
}

export default function SafeAssetLogo({
  src,
  symbol,
  name,
  size = 40,
  className = "",
}: SafeAssetLogoProps) {
  const [error, setError] = useState(false);
  
  const safeSrc = getSafeImageUrl(src);
  const shouldShowImage = safeSrc !== null && !error;

  if (shouldShowImage) {
    return (
      <img
        src={safeSrc}
        alt={`${name || symbol} logo`}
        width={size}
        height={size}
        className={`object-contain rounded-full ${className}`}
        loading="lazy"
        onError={() => setError(true)}
      />
    );
  }

  // Fallback to initials
  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-[#2563EB] text-white font-bold ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {symbol.charAt(0).toUpperCase()}
    </div>
  );
}
