import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import React from 'react';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserData } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type ResultsList = {
    id: number;
    title: string;
    studentName: string;
    teacherName: string;
    score: number;
    className: string;
    startTime: Date;
}


const ResultList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { role, userId } = await getUserData();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const columns = [
        {
            header: "Title",
            accessor: "title",
            className: "hidden sm:table-cell"
        },
        {
            header: "Student",
            accessor: "student",
        },
        {
            header: "Score",
            accessor: "Score",
            className: "hidden md:table-cell"
        },

        {
            header: "Teacher",
            accessor: "teacher",
            className: "hidden md:table-cell"
        },
        {
            header: "Class",
            accessor: "class",
            className: "hidden md:table-cell"
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell"
        },
        ...(role === "admin" || role === "teacher" ? [{
            header: "Actions",
            accessor: "actions",
        }] : [])

    ];

    const renderRow = (item: ResultsList) => (
        <tr key={item.id} className='border-b border-b-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight transition-all'>
            <td className='hidden sm:table-cell'>
                <h2 className='font-semibold'>{item.title}</h2>
            </td>
            <td className='p-4'>{item.studentName}</td>
            <td className='hidden md:table-cell'>{item.score}</td>
            <td className='hidden md:table-cell'>{item.teacherName}</td>
            <td className='hidden md:table-cell'>{item.className}</td>
            <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.startTime)}</td>
            <td>
                <div className='flex items-center gap-3'>
                    {
                        role === "admin" || role === "teacher" ? (<>
                            <FormContainer table='result' type='update' data={item} />
                            <FormContainer table='result' type='delete' id={item.id} />
                        </>):""
                    }

                </div>
            </td>
        </tr>
    );

    // URL params condations
    const query: Prisma.ResultWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.OR = [
                            { exam: { title: { contains: value, mode: "insensitive" } } },
                            { student: { name: { contains: value, mode: "insensitive" } } }
                        ]
                        break
                    case "studentId":
                        query.studentId = value
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
            query.OR = [
                { exam: { lesson: { teacherId: userId! } } },
                { assignment: { lesson: { teacherId: userId! } } }
            ]
            break
        case "student":
            query.studentId = userId!
            break
        case "parent":
            query.student = {
                parentId: userId!
            }
            break

        default:
            break;
    }

    const [dataResponse, count] = await prisma.$transaction([
        prisma.result.findMany({
            where: query,
            include: {
                student: { select: { name: true } },
                exam: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true } },
                            }
                        }
                    }
                },
                assignment: {
                    include: {
                        lesson: {
                            select: {
                                class: { select: { name: true } },
                                teacher: { select: { name: true } },
                            }
                        }
                    }
                }
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.result.count({ where: query })
    ]);

    const data = dataResponse.map(item => {
        const assessment = item.exam || item.assignment;
        if (!assessment) return null
        const isExam = "startTime" in assessment;
        return {
            id: item.id,
            title: assessment.title,
            studentName: item.student.name,
            teacherName: assessment.lesson.teacher.name,
            score: item.score,
            className: assessment.lesson.class.name,
            startTime: isExam ? assessment.startTime : assessment.startDate,
            studentId : item.studentId,
            examId : item.examId,
            assignmentId : item.assignmentId
        }
    })

    return (
        <div className='bg-white rounded-md p-4 flex-1 m-4'>
            {/* Top */}
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold hidden md:inline-block'>All Results</h1>
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
                          role === "admin" || role === "teacher" ? <FormContainer table='result' type='create' />:""
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

export default ResultList;
