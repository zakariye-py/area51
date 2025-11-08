import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

// Import logo from src/assets/
import logoImage from "@/assets/area51-logo.png";

interface LogoProps {
  /**
   * Size variant for the logo
   * @default "default"
   */
  size?: "sm" | "default" | "lg" | "xl";
  /**
   * Whether to show the logo as a link to home
   * @default true
   */
  linkToHome?: boolean;
  /**
   * Custom className for additional styling
   */
  className?: string;
  /**
   * Whether to show text alongside the logo
   * @default false
   */
  showText?: boolean;
}

const sizeClasses = {
  sm: "h-8",
  default: "h-10",
  lg: "h-16",
  xl: "h-24",
};

const textSizeClasses = {
  sm: "text-sm",
  default: "text-lg",
  lg: "text-2xl",
  xl: "text-4xl",
};

export const Logo = ({ 
  size = "default", 
  linkToHome = true,
  className,
  showText = false 
}: LogoProps) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  const logoElement = (
    <div className={cn("flex items-center space-x-2")}>
      {!imageError ? (
        <img
          src={logoImage}
          alt="Area 51 Booths Logo"
          className={cn(
            "object-contain w-auto",
            className || sizeClasses[size],
            "drop-shadow-[0_0_8px_rgba(0,255,0,0.3)]"
          )}
          onError={handleImageError}
        />
      ) : (
        // Fallback placeholder - matches the design aesthetic
        <div 
          className={cn(
            "flex items-center justify-center bg-gradient-neon rounded-full animate-pulse-glow shrink-0",
            className || sizeClasses[size],
            "w-auto aspect-square px-2"
          )}
        >
          <span className="text-white font-bold text-xs">A51</span>
        </div>
      )}
      {showText && (
        <span className={cn("font-bold text-white", textSizeClasses[size])}>
          Area 51 Booths
        </span>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="flex items-center hover:opacity-80 transition-opacity">
        {logoElement}
      </Link>
    );
  }

  return logoElement;
};
