import Announcements from '@/components/Announcements';
import BigCalendarContainer from '@/components/BigCalendarContainer';
import FormContainer from '@/components/FormContainer';
import PerformanceChart from '@/components/PerformanceChart';
import prisma from '@/lib/prisma';
import { getUserData } from '@/lib/utils';
import { Teacher } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';

const TeacherPage = async ({ params }: { params: { id: string } }) => {
    const { role  } = await getUserData()
    const teacher: Teacher & { _count: { subjects: number; lessons: number; classes: number; } } | null = await prisma.teacher.findUnique({
        where: {
            id: params.id
        },
        include: {
            _count: {
                select: {
                    subjects: true,
                    lessons: true,
                    classes: true,
                }
            }
        }
    });

    if (!teacher) {
        return notFound();
    }
    return (
        <div className='flex flex-1 p-4 flex-col xl:flex-row gap-4'>
            {/* left */}
            <div className='w-full xl:w-2/3'>
                {/* Top */}
                <div className='flex flex-col lg:flex-row gap-4'>
                    {/* user info card */}
                    <div className='bg-customSkyBlue py-6 px-4 rounded-md flex-1 flex flex-col sm:flex-row items-center justify-start gap-4'>
                        <div className="w-full sm:w-1/3 flex items-center justify-center">
                            <Image className='w-32 h-32 object-cover rounded-full' src={teacher.img || "/noAvatar.png"} alt='' width={140} height={140} />
                        </div>
                        <div className="w-full sm:w-2/3 flex flex-col items-center justify-between gap-4">
                            <div className='flex items-center gap-3'>
                                <h1 className='text-xl font-semibold'>{teacher.name + " " + teacher.surname}</h1>
                                {
                                    role === "admin" ?
                                        <FormContainer table='teacher' type='update' data={teacher} /> : ""
                                }
                            </div>
                            <div className='flex flex-col sm:flex-row lg:flex-col 2xl:flex-row justify-between text-sm font-medium lg:mt-6 xl:mt-0'>
                                <div className='w-1/2 flex flex-col gap-2'>
                                    <div className='w-max 2xl:w-1/3 flex items-center gap-2'>
                                        <Image alt='Blood' src={'/blood.png'} width={14} height={14} />
                                        <span>{teacher.bloodType}</span>
                                    </div>
                                    <div className='w-max 2xl:w-1/3 flex items-center gap-2'>
                                        <Image alt='Blood' src={'/date.png'} width={14} height={14} />
                                        <span>{new Intl.DateTimeFormat("en-GB").format(teacher.birthday)}</span>
                                    </div>
                                </div>
                                <div className='w-1/2 flex flex-col gap-2 mt-2 sm:mt-0 lg:mt-2 2xl:mt-0'>
                                    <div className='w-max 2xl:w-1/3 flex items-center gap-2'>
                                        <Image alt='Blood' src={'/mail.png'} width={14} height={14} />
                                        <span>{teacher.email || "_"}</span>
                                    </div>
                                    <div className='w-max 2xl:w-1/3 flex items-center gap-2'>
                                        <Image alt='Blood' src={'/phone.png'} width={14} height={14} />
                                        <span>{teacher.phone || "_"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* small cards */}
                    <div className='flex-1 flex gap-4 justify-between flex-wrap'>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleAttendance.png"} alt='' width={24} height={24} />
                            <div>
                                <h2 className='text-xl font-semibold'>90%</h2>
                                <span className='text-sm text-gray-400'>Attendance</span>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleClass.png"} alt='' width={24} height={24} />
                            <div>
                                <h2 className='text-xl font-semibold'>{teacher._count.classes}</h2>
                                <span className='text-sm text-gray-400'>Classes</span>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleLesson.png"} alt='' width={24} height={24} />
                            <div>
                                <h2 className='text-xl font-semibold'>{teacher._count.lessons}</h2>
                                <span className='text-sm text-gray-400'>Lessons</span>
                            </div>
                        </div>
                        <div className='bg-white p-4 rounded-md w-full flex gap-4 md:w-[45%] lg:w-full xl:w-[47%]'>
                            <Image className='w-6 h-6' src={"/singleBranch.png"} alt='' width={24} height={24} />
                            <div>
                                <h2 className='text-xl font-semibold'>{teacher._count.subjects}</h2>
                                <span className='text-sm text-gray-400'>Branches</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className='mt-4 bg-white p-4 rounded-md h-[800px]'>
                    <h1>Teacher&apos;s Schedule</h1>
                    <BigCalendarContainer type='teacherId' id={teacher.id} />
                </div>
            </div>

            {/* right */}
            <div className='w-full xl:w-1/3 flex flex-col gap-4'>
                <div className='bg-white p-4 rounded-md'>
                    <h1 className='text-xl font-semibold'>Shortcuts</h1>
                    <div className='mt-4 flex flex-wrap text-xs text-gray-500 gap-4'>
                        <Link className='p-3 rounded-md bg-customSkyBlueLight' href={`/list/classes?supervisorId=${teacher.id}`}>Teacher&apos;s Classes</Link>
                        <Link className='p-3 rounded-md bg-customPurpleLight' href={`/list/students?teacherId=${teacher.id}`}>Teacher&apos;s Students</Link>
                        <Link className='p-3 rounded-md bg-customYellowLight' href={`/list/lessons?teacherId=${teacher.id}`}>Teacher&apos;s Lessons</Link>
                        <Link className='p-3 rounded-md bg-pink-50' href={`/list/exams?teacherId=${teacher.id}`}>Teacher&apos;s Exams</Link>
                        <Link className='p-3 rounded-md bg-customSkyBlueLight' href={`/list/assignments?teacherId=${teacher.id}`}>Teacher&apos;s Assigments</Link>
                    </div>

                </div>
                <PerformanceChart />
                <Announcements />
            </div>
        </div>
    );
}

export default TeacherPage;
