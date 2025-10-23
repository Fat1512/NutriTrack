/*
 * Copyright 2025 NutriTrack
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
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
    primary: `bg-[#4ADE80] text-black font-bold hover:bg-[#33b362] ${
      disabled ? "opacity-50 cursor-not-allowed hover:bg-[#4ADE80]" : ""
    }`,
    default: `bg-gray-200 text-black hover:bg-gray-300 ${
      disabled ? "opacity-50 cursor-not-allowed hover:bg-gray-200" : ""
    }`,
    minimize: `bg-white text-black ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    }`,
    outlined: `border text-black hover:bg-gray-50 ${
      disabled
        ? "border-gray-300 text-gray-400 cursor-not-allowed hover:bg-white"
        : ""
    }`,
    danger: `bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow-sm hover:bg-red-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-400 transition-all duration-200 ${
      disabled
        ? "bg-red-300 shadow-none cursor-not-allowed hover:bg-red-300"
        : ""
    }`,
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className || ""}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
