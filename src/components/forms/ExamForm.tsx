import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { examSchema, ExamSchema } from '@/lib/formValidationSchemas';
import { createExam, updateExam } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';




const ExamForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: React.Dispatch<React.SetStateAction<boolean>>; relatedData?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ExamSchema>({
        resolver: zodResolver(examSchema),
    });
    const router = useRouter();
    const [state, formAction] = useFormState(type === "create" ? createExam : updateExam, { success: false, error: false });


    const onSubmit = handleSubmit(data => {
        formAction(data);
    });

    useEffect(() => {
        if (state.success) {
            toast(`Exam has been ${type === "create" ? "Created" : "Updated"} 🎉`);
            router.refresh();
            setOpen(false);
        }
    }, [state ,router , setOpen , type]);
    const { lessons } = relatedData;

    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Exam" : "Update the Exam"}</h1>

            <div className='flex flex-wrap justify-normal gap-4'>
                <InputField
                    label='Exam Title'
                    name='title'
                    register={register}
                    type='text'
                    defaultValue={data?.title}
                    error={errors?.title}
                />
                <InputField
                    label='Start Date'
                    name='startTime'
                    register={register}
                    type='datetime-local'
                    defaultValue={data?.startTime.toISOString().slice(0,16)}
                    error={errors?.startTime}
                />
                <InputField
                    label='End Date'
                    name='endTime'
                    register={register}
                    type='datetime-local'
                    defaultValue={data?.endTime.toISOString().slice(0,16)}
                    error={errors?.endTime}
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
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Lesson</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("lessonId")}
                        defaultValue={data?.lessonId}
                    >
                        {
                            lessons.map((lesson: { id: number, name: string }) => <option key={lesson.id} value={lesson.id}>{lesson.name}</option>)
                        }


                    </select>
                    {errors?.lessonId?.message && <p className='text-xs text-red-400'>{errors.lessonId.message.toString()}</p>}
                </div>
            </div>

            {state.error && <span className='text-red-500 text-sm'>Somthing went Wrong! Please Try again.</span>}
            <button type='submit' className='bg-blue-400 text-white rounded-md p-2'>{type === "create" ? "Create" : "Update"}</button>
        </form>
    );
}

export default ExamForm;
