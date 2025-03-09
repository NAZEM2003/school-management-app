import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { LessonSchema, lessonSchema } from '@/lib/formValidationSchemas';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { createLesson, updateLesson } from '@/lib/actions';
import { toast } from 'react-toastify';


const LessonForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: React.Dispatch<React.SetStateAction<boolean>>; relatedData: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LessonSchema>({
        resolver: zodResolver(lessonSchema),
    });

    const router = useRouter();
    const [state, formAction] = useFormState(type === "create" ? createLesson : updateLesson, { success: false, error: false });


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

    const { subjects, classes } = relatedData;
    const weekDays = ["MONDAY","TUESDAY", "WEDNESDAY",  "THURSDAY","FRIDAY"];
    
    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Lesson" : "Update the Lesson"}</h1>

            <div className='flex flex-wrap justify-normal gap-4'>
                <InputField
                    label='Lesson Name'
                    name='name'
                    register={register}
                    type='text'
                    defaultValue={data?.name}
                    error={errors?.name}
                />
                {/* Lesson Day */}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Day</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("day")}
                        defaultValue={data?.day}
                    >
                        {
                            weekDays.map((day) => <option selected={data && data.day === day} key={day} value={day}>{day}</option>)
                        }
                    </select>
                    {errors?.day?.message && <p className='text-xs text-red-400'>{errors.day.message.toString()}</p>}
                </div>
                <InputField
                    label='Start Time'
                    name='startTime'
                    register={register}
                    type='datetime-local'
                    defaultValue={data?.startTime.toISOString().slice(0,16)}
                    error={errors?.startTime}
                />
                <InputField
                    label='End Time'
                    name='endTime'
                    type='datetime-local'
                    register={register}
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
            </div>

            <div className='flex justify-between flex-wrap gap-4'>
                {/* Lesson subject */}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Subject</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("subjectId")}
                        defaultValue={data?.subjectId}
                    >
                        {
                            subjects.map((subject: { id: number, name: string }) => <option selected={data && data.subjectId === subject.id} key={subject.id} value={subject.id}>{subject.name}</option>)
                        }
                    </select>
                    {errors?.subjectId?.message && <p className='text-xs text-red-400'>{errors.subjectId.message.toString()}</p>}
                </div>
                {/* Lesson Class */}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Class</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("classId")}
                        defaultValue={data?.classId}
                    >
                        {
                            classes.map((subject: { id: number, name: string }) => <option selected={data && data.subjectId === subject.id} key={subject.id} value={subject.id}>{subject.name}</option>)
                        }
                    </select>
                    {errors?.classId?.message && <p className='text-xs text-red-400'>{errors.classId.message.toString()}</p>}
                </div>
            </div>

            {state.error && <span className='text-red-500 text-sm'>Somthing went Wrong! Please Try again.</span>}

            <button type='submit' className='bg-blue-400 text-white rounded-md p-2'>{type === "create" ? "Create" : "Update"}</button>
        </form>
    );
}

export default LessonForm;
