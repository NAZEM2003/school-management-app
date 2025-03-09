import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import Image from 'next/image';
import { teacherSchema, TeacherSchema } from '@/lib/formValidationSchemas';
import { useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import { createTeacher, updateTeacher } from '@/lib/actions';
import { toast } from 'react-toastify';
import { CldUploadWidget } from 'next-cloudinary';


const TeacherForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: React.Dispatch<React.SetStateAction<boolean>>; relatedData: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<TeacherSchema>({
        resolver: zodResolver(teacherSchema),
    });

    const [img, setImg] = useState<any>();
    const router = useRouter();
    const [state, formAction] = useFormState(type === "create" ? createTeacher : updateTeacher, { success: false, error: false });


    const onSubmit = handleSubmit(data => {
        formAction({ ...data, img: img?.secure_url });
    });

    useEffect(() => {
        if (type === "update") {
            setImg(data?.img)
        }
    }, [data , type]);

    useEffect(() => {
        if (state.success) {
            toast(`Teacher hs been ${type === "create" ? "Created" : "Updated"} 🎉`);
            router.refresh();
            setOpen(false);
        }
    }, [state , type , setOpen ,router]);

    const { subjects } = relatedData;

    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Teacher" : "Update the Teacher"}</h1>

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
            <div className='flex justify-between flex-wrap gap-4'>
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
                <InputField
                    label='Blood Type'
                    name='bloodType'
                    register={register}
                    type='text'
                    defaultValue={data?.bloodType}
                    error={errors?.bloodType}
                />
                <InputField
                    label='Birthday'
                    name='birthday'
                    register={register}
                    type='date'
                    defaultValue={data?.birthday.toISOString().split("T")[0]}
                    error={errors?.birthday}
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
                {/* teacher sex */}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Sex</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("sex")}
                        defaultValue={data?.sex}
                    >
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                    </select>
                    {errors?.sex?.message && <p className='text-xs text-red-400'>{errors.sex.message.toString()}</p>}
                </div>
                {/* teacher subjects */}
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Subjects</label>
                    <select
                        multiple
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("subjects")}
                        defaultValue={data?.subjects}
                    >
                        {
                            subjects.map((subject: { id: number, name: string }) => <option selected={data && data.subjectId === subject.id} key={subject.id} value={subject.id}>{subject.name}</option>)
                        }
                    </select>
                    {errors?.subjects?.message && <p className='text-xs text-red-400'>{errors.subjects.message.toString()}</p>}
                </div>
                {/* image upload */}
                <div className='flex items-center flex-col pt-5 gap-3'>
                    <Image className='rounded-full w-16 h-16 object-cover' src={img?.secure_url || data?.img || "/noAvatar.png"} width={65} height={65} alt='avatar' />
                    <CldUploadWidget uploadPreset="schoolmate" onSuccess={(result, { widget }) => {
                        setImg(result.info);
                        widget.close()
                    }}>
                        {({ open }) => {
                            return (
                                <div
                                    className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer'
                                    onClick={() => open()}>
                                    <Image src='/upload.png' alt='upload' width={28} height={28} />
                                    <span>Upload a Photo</span>
                                </div>
                            );
                        }}
                    </CldUploadWidget>
                </div>
            </div>

            {state.error && <span className='text-red-500 text-sm'>Somthing went Wrong! Please Try again.</span>}

            <button type='submit' className='bg-blue-400 text-white rounded-md p-2'>{type === "create" ? "Create" : "Update"}</button>
        </form>
    );
}

export default TeacherForm;
