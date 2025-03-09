import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import React from 'react';
import { Class, Exam, Prisma, Subject, Teacher } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserData } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type ExamsList = Exam & {
    lesson: {
        class: Class,
        teacher: Teacher,
        subject: Subject
    }
}




const ExamList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { role, userId } = await getUserData();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;


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
            className: "hidden md:table-cell"
        },

        {
            header: "Date",
            accessor: "date",
            className: "hidden sm:table-cell"
        },

        ...(role === " admin" || role === "teacher" ? [{
            header: "Actions",
            accessor: "actions",
        }] : [])
    ];


    const renderRow = (item: ExamsList) => (
        <tr key={item.id} className='border-b border-b-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight transition-all'>
            <td className='flex items-center gap-4 p-4'>
                <h2 className='font-semibold'>{item.lesson.subject.name}</h2>
            </td>
            <td className='hidden md:table-cell'>{item.lesson.class.name}</td>
            <td className='hidden md:table-cell'>{item.lesson.teacher.name}</td>
            <td className='hidden sm:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
            <td>
                <div className='flex items-center gap-3'>
                    {
                        role === "admin" || role === "teacher" && <>
                            <FormContainer table='exam' type='update' data={item} />
                            <FormContainer table='exam' type='delete' id={item.id} />
                        </>
                    }
                </div>
            </td>
        </tr>
    );


    // URL params condations
    const query: Prisma.ExamWhereInput = {};
    query.lesson = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.lesson.subject = { name: { contains: value, mode: "insensitive" } }
                        break
                    case "classId":
                        query.lesson.classId = parseInt(value);
                        break
                    case "teacherId":
                        query.lesson.teacherId = value
                        break
                }

            }
        }
    }

    // Role condations
    switch (role) {
        case "admin":
            break;
        case "teacher":
            query.lesson.teacherId = userId!
            break;
        case "student":
            query.lesson.class = {
                students: {
                    some: {
                        id: userId!
                    }
                }
            }
            break;
        case "parent":
            query.lesson.class = {
                students: {
                    some: {
                        parentId: userId!
                    }
                }
            }
            break;
        default:
            break;
    }
    const [data, count] = await prisma.$transaction([
        prisma.exam.findMany({
            where: query,
            include: {
                lesson: {
                    select: {
                        subject: { select: { name: true } },
                        teacher: { select: { name: true } },
                        class: { select: { name: true } }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.exam.count({ where: query })
    ]);

    return (
        <div className='bg-white rounded-md p-4 flex-1 m-4'>
            {/* Top */}
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold hidden md:inline-block'>All Exams</h1>
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
                            role === "admin" || role === "teacher" && <FormContainer table='exam' type='create' />
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

export default ExamList;
