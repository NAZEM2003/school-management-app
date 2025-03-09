import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';
import React from 'react';

const EventList = async ({ dateParam }: { dateParam: string | undefined }) => {
    const { userId, sessionClaims } = await auth();
    const role = (sessionClaims?.metadata as { role?: string })?.role
    const date = dateParam ? new Date(dateParam) : new Date();


    const roleCondations = {
        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { students: { some: { id: userId! } } },
        parent: { students: { some: { parentId: userId! } } },
    }
    const data = await prisma.event.findMany({
        where: {
            startTime: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999))
            },
            ...(role !== "admin" && {
                OR: [{ classId: null }, { class: roleCondations[role as keyof typeof roleCondations] || {} }]
            })
        }
    });

    return data.length > 0 ? data.map(event => (
        <div className='p-3 rounded-md border-2 border-gray-100 border-t-4 odd:border-t-customSkyBlue even:border-t-customPurple' key={event.id}>
            <div className='flex justify-between items-center'>
                <h1 className='font-semibold text-gray-600'>{event.title}</h1>
                <span className='text-xs text-gray-300'>{event.startTime.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                })}</span>
            </div>
            <p className='mt-2 text-gray-400 text-sm'>{event.description}</p>
        </div>
    )) : <h1 className='text-center font-semibold text-gray-600 my-2'>There are No Events for this Day!</h1>

}
export default EventList;
