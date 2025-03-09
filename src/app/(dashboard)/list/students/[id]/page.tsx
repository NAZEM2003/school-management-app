import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import FormContainer from '@/components/FormContainer';
import PerformanceChart from '@/components/PerformanceChart';
import StudentAttendanceCard from '@/components/StudentAttendanceCard';
import prisma from '@/lib/prisma';
import { getUserData } from '@/lib/utils';
import { Class, Student } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React, { Suspense } from 'react';

const StudentPage = async ({ params }: { params: { id: string } }) => {
    const { role } = await getUserData()
    const student: Student & { class: (Class & { _count: { lessons: number } }) } | null = await prisma.student.findUnique({
        where: {
            id: params.id
        },
        include: {
            class: { include: { _count: { select: { lessons: true } } } }
        }
    });

    if (!student) {
        return notFound();
    }
    return (
        <div className='flex flex-1 p-4 flex-col xl:flex-row gap-4'>
            {/* left */}
            <div className='w-full xl:w-2/3'>
                {/* Top */}
                <div className='flex flex-col lg:flex-row gap-4'>
                    {/* user info card */}
                    <div className='bg-customSkyBlue py-6 px-4 rounded-md flex-1 flex gap-4'>
                        <div className="w-1/3">
                            <Image className='w-32 h-32 object-cover rounded-full' src={student.img || "/avatar.png"} alt='' width={140} height={140} />
                        </div>
                        <div className="w-2/3 flex flex-col justify-between gap-4">
                            <div className='flex items-center gap-2'>
                                <h1 className='text-xl font-semibold'>{student.name + " " + student.surname}</h1>
                                {
                                    role === "admin" ?
                                        <FormContainer table='student' type='update' data={student} /> : ""
                                }
                            </div>
                            <p className='text-sm text-gray-500'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora?</p>
                            <div className='flex items-center justify-between gap-2 flex-wrap text-sm font-medium'>
                                <div className='w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <Image alt='Blood' src={'/blood.png'} width={14} height={14} />
                                    <span>{student.bloodType}</span>
                                </div>
                                <div className='w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <Image alt='Blood' src={'/date.png'} width={14} height={14} />
                                    <span>{new Intl.DateTimeFormat("en-GB").format(student.birthday)}</span>
                                </div>
                                <div className='w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <Image alt='Blood' src={'/mail.png'} width={14} height={14} />
                                    <span>{student.email || "_"}</span>
                                </div>
                                <div className='w-full 2xl:w-1/3 flex items-center gap-2'>
                                    <Image alt='Blood' src={'/phone.png'} width={14} height={14} />
                                    <span>{student.phone || "_"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* small cards */}
                    <div className='flex-1 flex gap-4 justify-between flex-wrap'>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleAttendance.png"} alt='' width={24} height={24} />
                            <Suspense fallback="Loading...">
                                <StudentAttendanceCard id={student.id} />
                            </Suspense>
                        </div>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleClass.png"} alt='' width={24} height={24} />
                            <div>
                                <h2 className='text-xl font-semibold'>{student.class.name}</h2>
                                <span className='text-sm text-gray-400'>Classe</span>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleLesson.png"} alt='' width={24} height={24} />
                            <div>
                                <h2 className='text-xl font-semibold'>{student.class._count.lessons}</h2>
                                <span className='text-sm text-gray-400'>Lessons</span>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleBranch.png"} alt='' width={24} height={24} />
                            <div>
                                <h2 className='text-xl font-semibold'>{student.class.name.charAt(0)}th</h2>
                                <span className='text-sm text-gray-400'>Grade</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className='mt-4 bg-white p-4 rounded-md h-[800px]'>
                    <h1>Student&apos;s Schedule</h1>
                    <BigCalendarContainer type='classId' id={student.class.id} />
                </div>
            </div>

            {/* right */}
            <div className='w-full xl:w-1/3 flex flex-col gap-4'>
                <div className='bg-white p-4 rounded-md'>
                    <h1 className='text-xl font-semibold'>Shortcuts</h1>
                    <div className='mt-4 flex flex-wrap text-xs text-gray-500 gap-4'>
                        <Link className='p-3 rounded-md bg-customSkyBlueLight' href={`/list/lessons?classId=${student.classId}`}>Student&apos;s Lessons</Link>
                        <Link className='p-3 rounded-md bg-customPurpleLight' href={`/list/teachers?classId=${student.classId}`}>Student&apos;s Teachers</Link>
                        <Link className='p-3 rounded-md bg-customYellowLight' href={`/list/results?studentId=${student.id}`}>Student&apos;s Results</Link>
                        <Link className='p-3 rounded-md bg-pink-50' href={`/list/exams?classId=${student.classId}`}>Student&apos;s Exams</Link>
                        <Link className='p-3 rounded-md bg-customSkyBlueLight' href={`/list/assignments?classId=${student.classId}`}>Student&apos;s Assigments</Link>
                    </div>

                </div>
                <PerformanceChart />
                <Announcements />
            </div>
        </div>
    );
}

export default StudentPage;
