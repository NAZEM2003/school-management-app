"use client"
import { deleteAnnouncement, deleteAssignment, deleteClass, deleteEvent, deleteExam, deleteLesson, deleteParent, deleteResult, deleteStudent, deleteSubject, deleteTeacher } from '@/lib/actions';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useFormState } from 'react-dom';
import { toast } from 'react-toastify';
import { formContainerProps } from './FormContainer';

const deleteActionMap = {
    teacher: deleteTeacher,
    student: deleteStudent,
    parent: deleteParent,
    subject: deleteSubject,
    classe: deleteClass,
    lesson: deleteLesson,
    exam: deleteExam,
    assignment: deleteAssignment,
    result: deleteResult,
    attendance: deleteSubject,
    event: deleteEvent,
    announcement: deleteAnnouncement,
}

const TeacherForm = dynamic(() => import("./forms/TeacherForm"), {
    loading: () => <h1 className='text-2xl font-semibold text-center'>Loading...</h1>
});
const StudentForm = dynamic(() => import("./forms/StudentForm"));
const ParentForm = dynamic(() => import("./forms/ParentForm"));
const ClasseForm = dynamic(() => import("./forms/ClasseForm"));
const AnnouncementForm = dynamic(() => import("./forms/AnnouncementForm"));
const AssignmentForm = dynamic(() => import("./forms/AssignmentForm"));
const AttendanceForm = dynamic(() => import("./forms/AttendanceForm"));
const EventForm = dynamic(() => import("./forms/EventForm"));
const

    ExamForm = dynamic(() => import("./forms/ExamForm"));
const LessonForm = dynamic(() => import("./forms/LessonForm"));
const ResultForm = dynamic(() => import("./forms/ResultForm"));
const SubjectForm = dynamic(() => import("./forms/SubjectForm"));



const forms: {
    [key: string]: (
        type: "create" | "update",
        data: any,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>,
        relatedData?: any
    ) => JSX.Element
} = {
    teacher: (type, data, setOpen, relatedData) => <TeacherForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    student: (type, data, setOpen, relatedData) => <StudentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    parent: (type, data, setOpen, relatedData) => <ParentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    subject: (type, data, setOpen, relatedData) => <SubjectForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    classe: (type, data, setOpen, relatedData) => <ClasseForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    lesson: (type, data, setOpen, relatedData) => <LessonForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    exam: (type, data, setOpen, relatedData) => <ExamForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    assignment: (type, data, setOpen, relatedData) => <AssignmentForm type={type} data={data} setOpen={setOpen} relatedData={relatedData} />,
    result: (type, data, setOpen) => <ResultForm type={type} data={data} setOpen={setOpen} />,
    // attendance: (type, data, setOpen) => <AttendanceForm type={type} data={data} setOpen={setOpen} />,
    event: (type, data, setOpen , relatedData) => <EventForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
    announcement: (type, data, setOpen , relatedData) => <AnnouncementForm type={type} data={data} setOpen={setOpen} relatedData={relatedData}/>,
};






const FormModal = (
    {
        table,
        type,
        data,
        id,
        relatedData
    }: formContainerProps & { relatedData: any }) => {

    const size = type === "create" ? "w-8 h-8" : "w-7 h-7";
    const bgColor = type === "create" ? "bg-customYellow" : type === "update" ? "bg-customSkyBlue" : "bg-customPurple";
    const [open, setOpen] = useState(false);


    const Form = () => {
        const [state, formAction] = useFormState(deleteActionMap[table], { success: false, error: false });

        const router = useRouter();

        useEffect(() => {
            if (state.success) {
                toast(`${table} Successfully Deleted 🗑️`);
                router.refresh();
                setOpen(false);
            }
        }, [state , router]);

        return type === "delete" && id ? (
            <form action={formAction} className='p-4 flex flex-col gap-4'>
                <input type="text | number" name='id' value={id} hidden />
                <span className='text-center font-medium'>All Date will be lost . Are You Sure You want to Delete this {table} ?</span>
                <button className='bg-red-700 px-4 py-2 rounded-md border-none text-white w-max self-center'>Delete</button>
            </form>
        ) : type === "create" || type === "update" ? (
            forms[table](type, data, setOpen, relatedData)
        ) : "form not found"
    }



    return (
        <>
            <button
                className={`${size} rounded-full flex items-center justify-center ${bgColor}`}
                onClick={() => setOpen(true)}>
                <Image src={`/${type}.png`} alt={type} width={16} height={16} />
            </button>
            {
                open && <div className='w-screen h-screen top-0 left-0 absolute bg-black bg-opacity-60 z-50 flex items-center justify-center'>
                    <div className='bg-white p-4 rounded-md relative w-[90%] md:w-[70%] lg:w-[60%] xl:w-[50%] 2xl:w-[40%]'>

                        <button
                            className='absolute top-4 right-8'
                            onClick={() => setOpen(false)}>
                            <Image src="/close.png" alt='close' width={14} height={14} />
                        </button>
                        <Form />

                    </div>
                </div>
            }
        </>
    );
}

export default FormModal;
