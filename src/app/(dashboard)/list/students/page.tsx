import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import React from 'react';
import Link from 'next/link';
import FormModal from '@/components/FormModal';
import { Class, Prisma, Student } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserData } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type studentsList = Student & { class: Class }

const StudentList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const {role , userId} = await getUserData();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const renderRow = (item: studentsList) => (
        <tr key={item.id} className='border-b border-b-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight transition-all'>
            <td className='flex items-center gap-4 p-4'>
                <Image
                    src={item.img || "/noAvatar.png"}
                    alt={item.name}
                    width={40}
                    height={40}
                    className='md:hidden xl:inline-block w-10 h-10 rounded-full object-cover' />
                <div className='flex flex-col'>
                    <h2 className='font-semibold'>{item.name}</h2>
                    <span className='text-xs text-gray-500'>{item?.class.name}</span>
                </div>
            </td>
            <td className='hidden md:table-cell'>{item.username}</td>
            <td className='hidden md:table-cell'>{item.class.name[0]}</td>
            <td className='hidden lg:table-cell'>{item.phone}</td>
            <td className='hidden lg:table-cell'>{item.address}</td>
            <td>
                <div className='flex items-center gap-3'>
                    <Link className='cursor-pointer w-7 h-7 rounded-full flex items-center justify-center bg-customSkyBlue' href={`/list/students/${item.id}`}>
                        <Image src="/view.png" alt='view' width={16} height={16} />
                    </Link>
                    {
                        role === "admin" && <FormContainer table='student' type='delete' id={item.id} />
                    }

                </div>
            </td>
        </tr>
    );

    const columns = [
        {
            header: "Info",
            accessor: "info"
        },
        {
            header: "Student ID",
            accessor: "studentId",
            className: "hidden md:table-cell"
        },
        {
            header: "Grade",
            accessor: "grade",
            className: "hidden md:table-cell"
        },
        {
            header: "Phone",
            accessor: "phone",
            className: "hidden lg:table-cell"
        },

        {
            header: "Adress",
            accessor: "adress",
            className: "hidden lg:table-cell"
        },
        {
            header: "Actions",
            accessor: "actions",
        },

    ];

    // URL params condations
    const query: Prisma.StudentWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {

                switch (key) {
                    case "teacherId":
                        query.class = {
                            lessons: {
                                some: {
                                    teacherId: value
                                }
                            }
                        }
                        break
                    case "search":
                        query.name = { contains: value, mode: "insensitive" }
                        break
                }

            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.student.findMany({
            where: query,
            include: {
                class: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.student.count({ where: query })
    ]);


    return (
        <div className='bg-white rounded-md p-4 flex-1 m-4'>
            {/* Top */}
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold hidden md:inline-block'>All Students</h1>
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
                            role === "admin" && <FormContainer table='student' type='create' />
                        }
                    </div>
                </div>
            </div>
            {/* list */}
            <Table columns={columns} renderRow={renderRow} data={data} />

            {/* pagination */}
            <Pagination count={count} page={p} />

        </div>
    );
}

export default StudentList;
