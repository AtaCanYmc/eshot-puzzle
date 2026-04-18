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
        <span className="w-full h-full flex items-center gap-3 px-10 py-4 bg-[#B931FC] text-white rounded-[14px] bg-gradient-to-t from-[#a62ce2] to-[#c045fc] font-bold text-lg md:text-xl">
          {icon && <span className="w-6 h-6 flex items-center">{icon}</span>}
          {children}
        </span>
      </button>
    );
  }
  // Secondary (glass/cam efektli)
  return (
    <button
      className={`inline-flex items-center justify-center px-10 py-4 rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm text-white font-semibold text-lg hover:bg-white/20 transition-all duration-200 ${className}`}
      {...props}
    >
      {icon && <span className="w-6 h-6 flex items-center mr-3">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;

