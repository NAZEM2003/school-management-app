import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import Link from 'next/link';
import React from 'react';

const Announcements = async () => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role

    const roleCondations = {
        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { students: { some: { id: userId! } } },
        parent: { students: { some: { parentId: userId! } } },
    }



    const data = await prisma.announcement.findMany({
        take: 3,
        orderBy: { date: "desc" },
        where: {
            ...(role !== "admin" && {
                OR: [{ classId: null }, { class: roleCondations[role as keyof typeof roleCondations] || {} }]
            })
        }
    });

    return (
        <div className='bg-white p-4 rounded-md'>
            <div className='flex justify-between items-center my-4'>
                <h1 className='text-lg font-semibold'>Announcements</h1>
                <Link  href="/list/announcements" className='text-xs text-gray-400'>View All</Link>
            </div>

            {
                data.length > 0 ? <div className='flex flex-col gap-4 mt-4'>
                    {data[0] &&
                        <div className='bg-customSkyBlue rounded-md p-4'>
                            <div className='flex justify-between items-center'>
                                <h1 className='font-medium'>{data[0]?.title}</h1>
                                <span className='text-xs text-gray-400 rounded-md p-1 bg-white'>{new Intl.DateTimeFormat("en-GB").format(data[0].date)}</span>
                            </div>
                            <p className='text-sm text-gray-400 mt-3'>{data[0].description}</p>
                        </div>
                    }

                    {data[1] &&
                        <div className='bg-customYellowLight rounded-md p-4'>
                            <div className='flex justify-between items-center'>
                                <h1 className='font-medium'>{data[1].title}</h1>
                                <span className='text-xs text-gray-400 rounded-md p-1 bg-white'>{new Intl.DateTimeFormat("en-GB").format(data[1].date)}</span>
                            </div>
                            <p className='text-sm text-gray-400 mt-3'>{data[1].description}</p>
                        </div>
                    }

                    {data[2] &&
                        <div className='bg-customPurpleLight rounded-md p-4'>
                            <div className='flex justify-between items-center'>
                                <h1 className='font-medium'>{data[2].title}</h1>
                                <span className='text-xs text-gray-400 rounded-md p-1 bg-white'>{new Intl.DateTimeFormat("en-GB").format(data[2].date)}</span>
                            </div>
                            <p className='text-sm text-gray-400 mt-3'>{data[2].description}</p>
                        </div>
                    }

                </div> : <h1 className='text-center font-semibold text-gray-600 my-10'>There is no Announcement!</h1>
            }

        </div>
    );
}

export default Announcements;
