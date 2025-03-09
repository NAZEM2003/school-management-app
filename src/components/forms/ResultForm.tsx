import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { ResultSchema, resultSchema } from '@/lib/formValidationSchemas';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { createResult, updateResult } from '@/lib/actions';
import { toast } from 'react-toastify';


const ResultForm = ({ type, data, setOpen }: { type: "create" | "update"; data?: any; setOpen: React.Dispatch<React.SetStateAction<boolean>>}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResultSchema>({
        resolver: zodResolver(resultSchema),
    });

    const router = useRouter();
    const [state, formAction] = useFormState(type === "create" ? createResult : updateResult, { success: false, error: false});

    const onSubmit = handleSubmit(data => {
        formAction(data);
    });

    useEffect(() => {
        if (state.success) {
            toast(`Lesson has been ${type === "create" ? "Created" : "Updated"} 🎉`);
            router.refresh();
            setOpen(false);
        }
    }, [state ,router , setOpen , type]);
    
    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Lesson" : "Update the Lesson"}</h1>

            <div className='flex flex-wrap justify-normal gap-4'>
                <InputField
                    label='Score'
                    name='score'
                    register={register}
                    type='number'
                    defaultValue={data?.score}
                    error={errors?.score}
                />
                <InputField
                    label='Student ID'
                    name='studentId'
                    register={register}
                    defaultValue={data?.studentId}
                    error={errors?.studentId}
                />
                <InputField
                    label='Exam ID'
                    name='examId'
                    type='number'
                    register={register}
                    defaultValue={data?.examId}
                    error={errors?.examId}
                />
                <InputField
                    label='Assignment ID'
                    name='assignmentId'
                    type='number'
                    register={register}
                    defaultValue={data?.assignmentId}
                    error={errors?.assignmentId}
                />
                {
                    data && (<InputField
                        label='id'
                        name='id'
                        register={register}
                        type='text'
                        defaultValue={data?.id}
                        error={errors?.id}
                        hidden={true}
                    />)

                }
            </div>

            {state.error && <span className='text-red-500 text-sm'>Somthing went Wrong! Please Try again.</span>}

            <button type='submit' className='bg-blue-400 text-white rounded-md p-2'>{type === "create" ? "Create" : "Update"}</button>
        </form>
    );
}

export default ResultForm;
