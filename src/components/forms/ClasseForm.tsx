import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { classSchema, ClassSchema, subjectSchema, SubjectSchema } from '@/lib/formValidationSchemas';
import { createClass, updateClass } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';




const SubjectForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: React.Dispatch<React.SetStateAction<boolean>>; relatedData?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ClassSchema>({
        resolver: zodResolver(classSchema),
    });
    const router = useRouter();
    const [state, formAction] = useFormState(type === "create" ? createClass : updateClass, { success: false, error: false });


    const onSubmit = handleSubmit(data => {
        formAction(data);
    });

    useEffect(() => {
        if (state.success) {
            toast(`Class has been ${type === "create" ? "Created" : "Updated"} 🎉`);
            router.refresh();
            setOpen(false);
        }
    }, [state ,router , setOpen , type]);
    const { teachers, grades } = relatedData;

    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Class" : "Update the Class"}</h1>

            <div className='flex flex-wrap justify-normal gap-4'>
                <InputField
                    label='Class Name'
                    name='name'
                    register={register}
                    type='text'
                    defaultValue={data?.name}
                    error={errors?.name}
                />
                <InputField
                    label='Capacity'
                    name='capacity'
                    register={register}
                    type='text'
                    defaultValue={data?.capacity}
                    error={errors?.capacity}
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
                    <label className='text-xs text-gray-500'>Supervisor</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("supervisorId")}
                        defaultValue={data?.teachers}
                    >
                        {
                            teachers.map((teacher: { id: string, name: string }) => <option selected={data && teacher.id === data.supervisorId} key={teacher.id} value={teacher.id}>{teacher.name}</option>)
                        }


                    </select>
                    {errors?.supervisorId?.message && <p className='text-xs text-red-400'>{errors.supervisorId.message.toString()}</p>}
                </div>
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Grade</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("gradeId")}
                        defaultValue={data?.gradeId}
                    >
                        {
                            grades.map((grade: { id: number, level: number }) => <option selected={data && grade.id === data.gradeId} key={grade.id} value={grade.id}>{grade.level}</option>)
                        }


                    </select>
                    {errors?.gradeId?.message && <p className='text-xs text-red-400'>{errors.gradeId.message.toString()}</p>}
                </div>
            </div>

            {state.error && <span className='text-red-500 text-sm'>Somthing went Wrong! Please Try again.</span>}
            <button type='submit' className='bg-blue-400 text-white rounded-md p-2'>{type === "create" ? "Create" : "Update"}</button>
        </form>
    );
}

export default SubjectForm;
