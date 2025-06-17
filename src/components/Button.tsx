import { type ReactElement } from 'react';

interface ButtonProps {
    title: string;
    size: "lg" | "sm" | "md";
    startIcon?: ReactElement;
    endIcon?: ReactElement;
    variant: "primary" | "secondary";
    onClick?:()=>void;
}

const sizeStyles = {
    lg: "px-8 py-4 text-xl rounded-xl",
    md: "px-4 py-2 text-md rounded-md",
    sm: "px-2 py-1 text-sm rounded-sm",
};

const variantStyles = {
    primary: "bg-purple-600 text-white hover:bg-purple-700",
    secondary: "bg-purple-300 text-black hover:bg-purple-400",
};

const Button = (props: ButtonProps) => {
    const { title, size, variant, startIcon, endIcon } = props;

    const classes = `${variantStyles[variant]} ${sizeStyles[size]} flex items-center gap-2 transition duration-200`;

    return (
        <button onClick={props.onClick} className={classes}>
            {startIcon && <span>{startIcon}</span>}
            {title}
            {endIcon && <span>{endIcon}</span>}
        </button>
    );
};

export default Button;
