import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import InputField from '../InputField';
import Image from 'next/image';


const schema = z.object({
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long!' })
        .max(20, { message: 'Username must be at most 20 characters long!' }),
    email: z.string().email({ message: "invalid Email Address!" }),
    password: z.string()
        .min(4, { message: 'Password must be at least 4 characters long!' })
        .max(16, { message: 'Password must be at most 16 characters long!' }),
    firstName: z.string().min(1, { message: 'First name is Required!' }),
    lastName: z.string().min(1, { message: 'Last name is Required!' }),
    phone: z.string().min(1, { message: 'Phone number is Required!' }),
    bloodType: z.string().min(1, { message: 'Blood Type is Required!' }),
    address: z.string().min(1, { message: 'Address is Required!' }),
    birthday: z.date({ message: 'Birthday is Required!' }),
    sex: z.enum(["male", "female"], { message: "sex is Required" }),
    img: z.instanceof(File, { message: "Image is Required" })
});
type Inputs = z.infer<typeof schema>;

const AttendanceForm = ({ type, data }: { type: "create" | "update"; data?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>({
        resolver: zodResolver(schema),
    });

    const onSubmit = handleSubmit(data => {
        console.log(data);

    });




    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>Create a new Attendance</h1>

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
                    name='firstName'
                    register={register}
                    defaultValue={data?.firstName}
                    error={errors?.firstName}
                />
                <InputField
                    label='Last Name'
                    name='lastName'
                    register={register}
                    defaultValue={data?.lastName}
                    error={errors?.lastName}
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
                    register={register}
                    defaultValue={data?.address}
                    error={errors?.address}
                />
                <InputField
                    label='Blood Type'
                    name='bloodType'
                    register={register}
                    type='email'
                    defaultValue={data?.bloodType}
                    error={errors?.bloodType}
                />
                <InputField
                    label='Birthday'
                    name='birthday'
                    register={register}
                    type='date'
                    defaultValue={data?.birthday}
                    error={errors?.birthday}
                />
                <div className='flex flex-col gap-2 w-full md:w-1/4'>
                    <label className='text-xs text-gray-500'>Sex</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("sex")}
                        defaultValue={data?.sex}
                    >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    {errors?.sex?.message && <p className='text-xs text-red-400'>{errors.sex.message.toString()}</p>}
                </div>

                <div className='flex flex-col justify-center gap-2 w-full md:w-1/4'>
                    <label htmlFor='img' className='text-xs text-gray-500 flex items-center gap-2 cursor-pointer'>
                        <Image src='/upload.png' alt='upload' width={28} height={28} />
                        <span>Upload a Photo</span>
                    </label>
                    <input className='hidden' id='img' type="file" {...register("img")} />
                    {errors?.img?.message && <p className='text-xs text-red-400'>{errors.img.message.toString()}</p>}
                </div>
            </div>

            <button type='submit' className='bg-blue-400 text-white rounded-md p-2'>{type === "create" ? "Create" : "Update"}</button>
        </form>
    );
}

export default AttendanceForm;
