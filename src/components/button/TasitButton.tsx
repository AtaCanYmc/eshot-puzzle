import * as React from "react";

interface TasitButtonProps {
    identifier: string;
    icon: string;
    text: string;
    onClick?: () => void;
}

export const TasitButton = (props: TasitButtonProps) => {
    const {
        identifier,
        icon,
        text,
        onClick = () => {
        },
    } = props;
    return (
        <button
            key={identifier}
            onClick={onClick}
            className={`p-2 rounded-xl border-2 text-center group flex gap-2 items-center justify-center w-full bg-primary/10 border-primary text-primary font-black`}>
            <img src={icon} alt="tasit" className="w-5 h-5"/>
            <span className="block text-base font-black group-hover:scale-110 transition-transform">{text}</span>
        </button>
    );
};