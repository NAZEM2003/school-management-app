import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import InputField from '../InputField';
import { announcementSchema, AnnouncementSchema } from '@/lib/formValidationSchemas';
import { createAnnouncement, updateAnnouncement } from '@/lib/actions';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';




const EventForm = ({ type, data, setOpen, relatedData }: { type: "create" | "update"; data?: any; setOpen: React.Dispatch<React.SetStateAction<boolean>>; relatedData?: any }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<AnnouncementSchema>({
        resolver: zodResolver(announcementSchema),
    });
    const router = useRouter();
    const [state, formAction] = useFormState(type === "create" ? createAnnouncement : updateAnnouncement, { success: false, error: false });


    const onSubmit = handleSubmit(data => {
        formAction(data);
    });

    useEffect(() => {
        if (state.success) {
            toast(`Announcement has been ${type === "create" ? "Created" : "Updated"} 🎉`);
            router.refresh();
            setOpen(false);
        }
    }, [state ,router , setOpen , type]);
    const { classes } = relatedData;

    return (
        <form className='flex flex-col gap-8 max-h-[520px] overflow-y-scroll p-2' onSubmit={onSubmit}>
            <h1 className='text-xl font-semibold'>{type === "create" ? "Create a new Announcement" : "Update the Announcement"}</h1>

            <div className='flex flex-wrap justify-normal gap-4'>
                <InputField
                    label='Announcement Title'
                    name='title'
                    register={register}
                    type='text'
                    defaultValue={data?.title}
                    error={errors?.title}
                />
                <InputField
                    label='Date'
                    name='date'
                    register={register}
                    type='datetime-local'
                    defaultValue={data?.date.toISOString().slice(0, 16)}
                    error={errors?.date}
                />
                <InputField
                    label='Announcement Description'
                    name='description'
                    register={register}
                    type='text'
                    defaultValue={data?.description}
                    error={errors?.description}
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
                    <label className='text-xs text-gray-500'>Class</label>
                    <select
                        className='ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm outline-none w-full'
                        {...register("classId")}
                        defaultValue={data?.classId}
                    >
                        {
                            classes.map((classItem: { id: number, name: string }) => <option key={classItem.id} value={classItem.id}>{classItem.name}</option>)
                        }
                        <option value={""}>General Event</option>
                    </select>
                    {errors?.classId?.message && <p className='text-xs text-red-400'>{errors.classId.message.toString()}</p>}
                </div>
            </div>

            {state.error && <span className='text-red-500 text-sm'>Somthing went Wrong! Please Try again.</span>}
            <button type='submit' className='bg-blue-400 text-white rounded-md p-2'>{type === "create" ? "Create" : "Update"}</button>
        </form>
    );
}

export default EventForm;
