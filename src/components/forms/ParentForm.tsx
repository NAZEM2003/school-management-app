import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { parentSchema, ParentSchema } from '@/lib/formValidationSchemas';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { createParent, updateParent } from '@/lib/actions';
import { toast } from 'react-toastify';
import Image from 'next/image';


const StudentForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: React.Dispatch<React.SetStateAction<boolean>>; relatedData: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ParentSchema>({
        resolver: zodResolver(parentSchema),
    });

    const [studentIds, setStudentIds] = useState<string[]>([""]);

    const router = useRouter();
    const [state, formAction] = useFormState(type === "create" ? createParent : updateParent, { success: false, error: false });


    const onSubmit = handleSubmit(data => {
        data.students = studentIds;
        formAction(data);
    });


    const handleStudentInputChange = (index: number, value: string) => {
        const newIds = [...studentIds];
        newIds[index] = value;
        setStudentIds(newIds);
    };
    const addNewInput = () => {
        setStudentIds([...studentIds, ""]);
    };
    const removeInput = (e: React.FormEvent,index: number) => {
        e.preventDefault();
        if (studentIds.length === 1) return false
        const newIds = studentIds.filter((_, i) => i !== index);
        setStudentIds(newIds);
    }

    useEffect(() => {
        if (type === "update") {
            setStudentIds([...(data?.students.map((student: { id: string, name: string }) => student.id))]);
        }
    }, [data ,router , setOpen , type])
    useEffect(() => {
        if (state.success) {
            toast(`Parent hs been ${type === "create" ? "Created" : "Updated"} 🎉`);
            router.refresh();
            setOpen(false);
        }
    }, [state ,router , setOpen , type]);

    // const { } = relatedData;

    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Parent" : "Update the Parent"}</h1>

            <span className='text-xs text-gray-400 font-medium'>Authentication Information</span>
            <div className='flex flex-wrap justify-normal gap-4'>
                <InputField
                    label='UserName'
                    name='username'
                    register={register}
                    type='text'
                    defaultValue={data?.username}
                    error={errors?.username}
                />
                <InputField
                    label='Email'
                    name='email'
                    register={register}
                    type='email'
                    defaultValue={data?.email}
                    error={errors?.email}
                />
                <InputField
                    label='Password'
                    name='password'
                    register={register}
                    type='password'
                    defaultValue={data?.password}
                    error={errors?.password}
                />
            </div>

            <span className='text-xs text-gray-400 font-medium'>Personnal Information</span>
            <div className='flex justify-normal flex-wrap gap-4'>
                <InputField
                    label='First Name'
                    name='name'
                    register={register}
                    defaultValue={data?.name}
                    error={errors?.name}
                />
                <InputField
                    label='Last Name'
                    name='surname'
                    register={register}
                    defaultValue={data?.surname}
                    error={errors?.surname}
                />
                <InputField
                    label='Phone'
                    name='phone'
                    register={register}
                    defaultValue={data?.phone}
                    error={errors?.phone}
                />
                <InputField
                    label='Address'
                    name='address'
                    type='text'
                    register={register}
                    defaultValue={data?.address}
                    error={errors?.address}
                />
                <div className='w-full relative'>
                    {
                        studentIds.map((id, index) => (
                            <div className='flex mt-5 items-end gap-3' key={index}>
                                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                                    <label htmlFor={id} className='text-xs text-gray-500'>Student ID</label>
                                    <input
                                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                                        id={id}
                                        type='text'
                                        value={id}                                        
                                        onChange={(e) => handleStudentInputChange(index, e.target.value)} />
                                </div>
                                <button onClick={(e) => removeInput(e,index)} className='bg-customPurple p-2 rounded-md'>
                                    <Image src={"/delete.png"} width={20} height={20} alt='delete' />
                                </button>
                            </div>
                        ))
                    }

                    <button className='text-blue-400 font-semibold p-2 absolute border border-blue-400 rounded-md top-10 right-3' type='button' onClick={() => addNewInput()}>
                        Add Student ID
                    </button>
                </div>
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

export default StudentForm;
