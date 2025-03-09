import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import React from 'react';
import FormModal from '@/components/FormModal';
import { Class, Lesson, Prisma, Subject, Teacher } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserData } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type LessonsList = Lesson & { teacher: Teacher } & { class: Class } & { subject: Subject }




const LessonList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { role } = await getUserData();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const renderRow = (item: LessonsList) => (
        <tr key={item.id} className='border-b border-b-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight transition-all'>
            <td className='flex items-center gap-4 p-4'>
                <h2 className='font-semibold'>{item.subject.name}</h2>
            </td>
            <td className='hidden md:table-cell'>{item.class.name}</td>
            <td className='hidden sm:table-cell'>{item.teacher.name}</td>
            <td>
                <div className='flex items-center gap-3'>
                    {
                        role === "admin" && <>
                            <FormContainer table='lesson' type='update' data={item} />
                            <FormContainer table='lesson' type='delete' id={item.id} />
                        </>
                    }

                </div>
            </td>
        </tr>
    );

    const columns = [
        {
            header: "Subject",
            accessor: "subject"
        },
        {
            header: "Class",
            accessor: "class",
            className: "hidden md:table-cell"
        },
        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden sm:table-cell"
        },
        ...(role === "admin" ? [{
            header: "Actions",
            accessor: "actions",
        }] : [])
    ];

    // URL params condations
    const query: Prisma.LessonWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "classId":
                        query.classId = parseInt(value);
                        break;
                    case "teacherId":
                        query.teacherId = value;
                        break;
                    case "search":
                        query.OR = [
                            { subject: { name: { contains: value, mode: "insensitive" } } },
                            { teacher: { name: { contains: value, mode: "insensitive" } } },
                        ];
                        break;
                    default:
                        break;
                }
            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.lesson.findMany({
            where: query,
            include: {
                teacher: { select: { name: true } },
                subject: { select: { name: true } },
                class: { select: { name: true } },
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.lesson.count({ where: query })
    ]);

    return (
        <div className='bg-white rounded-md p-4 flex-1 m-4'>
            {/* Top */}
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold hidden md:inline-block'>All Lessons</h1>
                <div className='flex flex-col md:flex-row items-center gap-4 w-full md:w-auto'>
                    <TableSearch />
                    <div className='w-full md:w-auto flex items-center justify-end gap-4'>
                        <button className='w-8 h-8 rounded-full flex items-center justify-center bg-customYellow'>
                            <Image src="/filter.png" alt='filter' width={14} height={14} />
                        </button>
                        <button className='w-8 h-8 rounded-full flex items-center justify-center bg-customYellow'>
                            <Image src="/sort.png" alt='filter' width={14} height={14} />
                        </button>
                        {
                            role === "admin" && <FormContainer table='lesson' type='create' />

                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={data} />

            {/* pagination */}
            <Pagination page={p} count={count} />

        </div>
    );
}

export default LessonList;
