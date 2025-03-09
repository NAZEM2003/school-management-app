import React from 'react';
import AttendanceChart from './AttendanceChart';
import Image from 'next/image';
import prisma from '@/lib/prisma';

const AttendanceChartContainer = async () => {
    const today = new Date();
    const dayOfWeek = today.getDate();
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - daysSinceMonday);

    const resData = prisma.attendance.findMany({
        where: {
            date: {
                gte: lastMonday
            }
        },
        select: {
            date: true,
            present: true
        }
    });

    const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri"];

    const attendanceMap : {[key:string] :{absent:number , present:number}} = {
        Mon: { present: 0, absent: 0 },
        Tue: { present: 0, absent: 0 },
        Wed: { present: 0, absent: 0 },
        Thu: { present: 0, absent: 0 },
        Fri: { present: 0, absent: 0 },
    };

    (await resData).forEach(item => {
        const itemDate = new Date(item.date);
        if (dayOfWeek >= 1 && dayOfWeek <= 5) {
            const dayName = daysOfWeek[dayOfWeek - 1];
            if (item.present) {
                attendanceMap[dayName].present += 1;
            } else {
                attendanceMap[dayName].absent += 1;
            }
        }
    });

    const data = daysOfWeek.map(day=>({
        name : day,
        present : attendanceMap[day].present,
        absent : attendanceMap[day].absent
    }));
    
    return (
        <div className='bg-white rounded-xl w-full h-full p-2'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Attendance</h1>
                <Image src="/moreDark.png" width={20} height={20} alt='more' />
            </div>
            <AttendanceChart data={data}/>
        </div>
    );
}

export default AttendanceChartContainer;
