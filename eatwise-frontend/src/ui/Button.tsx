import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: "primary" | "default" | "outlined" | "minimize" | "danger";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className,
  disabled = false,
  variant = "default",
}) => {
  const baseClasses =
    "cursor-pointer rounded-sm px-5 py-2 transition-colors duration-200";

  const variantClasses = {
    primary: "bg-[#4ADE80] text-black font-bold hover:bg-[#33b362]",
    default: "bg-gray-200 text-black hover:bg-gray-300",
    minimize: "bg-white text-black",
    outlined:
      "border text-black hover:bg-gray-50 disabled:border-gray-300 disabled:text-gray-400",
    danger:
      "bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 disabled:bg-red-300 disabled:shadow-none disabled:cursor-not-allowed",
  };

  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
