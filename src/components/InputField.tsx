import React from 'react';
import { FieldError } from 'react-hook-form';

type inputFieldProps = {
    type?: string;
    label: string;
    register: any;
    name: string;
    defaultValue?: string;
    error?: FieldError;
    inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
    hidden?: boolean
}
const InputField = ({
    type = "text",
    label,
    register,
    name,
    defaultValue,
    error,
    inputProps,
    hidden
}: inputFieldProps) => {
    return (
        <div className={hidden ? "hidden" : 'flex flex-col gap-2 w-full md:w-1/4'}>
            <label className='text-xs text-gray-500'>{label}</label>
            <input
                type={type}
                {...register(name)}
                {...inputProps}
                defaultValue={defaultValue}
                className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full' />
            {error?.message && <p className='text-xs text-red-400'>{error.message.toString()}</p>}
        </div>
    );
}

export default InputField;
