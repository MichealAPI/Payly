import React from "react";
import PropTypes from "prop-types";

const Button = ({
  text,
  className,
  onClick,
  size = "medium",
  style = "fill",
  bgColor = "radial-gradient(50% 50.01% at 50% 51.16%, #611FED 14.9%, #7535FB 100%)",
  hoverBgColor = "radial-gradient(50% 50.01% at 50% 51.16%, #B897FF 14.9%, #BD9EFF 100%)",
  shadowColor = "0px 0px 6.6px 7px rgba(198,172,255,0.25)",
  borderColor = "#C6ACFF",
  textVisibility = true,
  iconVisibility = false,
  type = "button",
  icon,
  disabled = false,
}) => {
  const baseStyles =
    "font-bold text-base text-secondary relative overflow-hidden transition-transform duration-100 ease-linear cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.025] disabled:opacity-50 disabled:cursor-not-allowed";

  const sizeStyles = {
    large: "py-2.5 px-[90px] rounded-[5px]",
    medium: "py-2.5 px-[45px] rounded-[5px]",
    full: "w-full py-2.5 px-5 rounded-[5px]",
    minimal: "justify-center items-center rounded-full w-12 h-12 p-0",
  };

  const styleClasses = {
    fill: `
    border border-solid 

    [border-color:var(--border-color)]  

    shadow-[var(--shadow-color)]  

    [background-image:var(--bg-color)]  

    before:content-[''] before:absolute before:inset-0
    before:[background-image:var(--hover-bg-color)] before:opacity-0
    before:transition-opacity before:duration-100 before:ease-linear before:z-10
    hover:before:opacity-100
  `,
    outline: `bg-transparent border-2 border-white`,
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        "--bg-color": bgColor,
        "--hover-bg-color": hoverBgColor,
        "--shadow-color": shadowColor,
        "--border-color": borderColor,
      }}
      className={`
      ${baseStyles}
      ${sizeStyles[size]}
      ${styleClasses[style]}
      ${className || ""}
    `}
    >
      <div className="relative z-20 flex items-center justify-center gap-2">
        {textVisibility && size !== "minimal" && (
          <span className="text">{text}</span>
        )}
        {iconVisibility && icon && <span>{icon}</span>}
      </div>
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  size: PropTypes.oneOf(["minimal", "medium", "large", "full"]),
  style: PropTypes.oneOf(["fill", "outline"]),
  textVisibility: PropTypes.bool,
  iconVisibility: PropTypes.bool,
  icon: PropTypes.element,
  className: PropTypes.string,
  bgColor: PropTypes.string,
  hoverBgColor: PropTypes.string,
  shadowColor: PropTypes.string,
  borderColor: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default Button;
