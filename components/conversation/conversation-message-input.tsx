"use client";

import React from "react";
import {
    FieldErrors,
    FieldValues,
    UseFormRegister,
} from "react-hook-form";

interface IMessageInputProps {
    id: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    required?: boolean;
    placeholder?: string;
    type?: string;
}

const MessageInput = ({
                                                        id,
                                                        register,
                                                        errors,
                                                        required,
                                                        placeholder,
                                                        type,
                                                    }: IMessageInputProps) => {
    return (
        <div className='relative w-full '>
        <input
            className='w-full px-4 py-2 font-light text-black rounded-full  bg-neutral-100 focus:outline-none'
    id={id}
    type={type}
    autoComplete={id}
    {...register(id, { required })}
    placeholder={placeholder}
    />
    </div>
);
};

export default MessageInput;
