import React from "react";

// Type untuk props
type ButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  className?: string;
};

const Button = ({
  children,
  onClick,
  isActive,
  disabled,
  className,
}: ButtonProps) => {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={`relative px-6 py-3 font-semibold rounded-md overflow-hidden transition-all duration-300 
        ${isActive ? "bg-gray-300 text-black" : "bg-[#3daa25] text-white"} // Gaya tombol berdasarkan isActive
        hover:shadow-lg group ${className ?? ""} ${disabled ? " cursor-not-allowed" : ""}`}
    >
      <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;
