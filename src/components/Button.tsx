import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  icon?: React.ReactNode;
  variant?: "primary" | "secondary";
}

const Button: React.FC<ButtonProps> = ({
  children,
  icon,
  variant = "primary",
  className = "",
  ...props
}) => {
  if (variant === "primary") {
    return (
      <button
        className={`relative cursor-pointer opacity-90 hover:opacity-100 transition-opacity p-[2px] bg-black rounded-[16px] bg-gradient-to-t from-[#8122b0] to-[#dc98fd] active:scale-95 ${className}`}
        {...props}
      >
        <span className="w-full h-full flex items-center gap-2 px-8 py-3 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc] font-bold text-base md:text-lg">
          {icon && <span className="w-5 h-5 flex items-center">{icon}</span>}
          {children}
        </span>
      </button>
    );
  }
  // Secondary (glass/cam efektli)
  return (
    <button
      className={`inline-flex items-center justify-center px-8 py-3 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white font-semibold text-base hover:bg-white/20 transition-all duration-200 ${className}`}
      {...props}
    >
      {icon && <span className="w-5 h-5 flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

