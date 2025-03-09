import prisma from '@/lib/prisma';
import React from 'react';
import BigCalendar from './BigCalendar';
import { adjustScheduleToCurrentWeek } from '@/lib/utils';

const BigCalendarContainer = async ({ type, id }: { type: "teacherId" | "classId"; id: string | number }) => {
    const resData = await prisma.lesson.findMany({
        where: {
            ...(type === "teacherId" ? { teacherId: id as string } : { classId: id as number })
        }
    });

    const data = resData.map(lesson => ({
        title: lesson.name,
        start: lesson.startTime,
        end: lesson.endTime
    }));

    const schedule = adjustScheduleToCurrentWeek(data);

    return <BigCalendar data={schedule} />
}

export default BigCalendarContainer;
