import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import React from 'react';
import { Parent, Prisma, Student } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserData } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type ParentsList = Parent & { students: Student[] }

const ParentList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { role, userId } = await getUserData();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const renderRow = (item: ParentsList) => (
        <tr key={item.id} className='border-b border-b-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight transition-all'>
            <td className='flex items-center gap-4 p-4'>
                <div className='flex flex-col'>
                    <h2 className='font-semibold'>{item.name}</h2>
                    <span className='text-xs text-gray-500'>{item?.email}</span>
                </div>
            </td>
            <td className='hidden md:table-cell'>{item.students.map(student => student.name).join(",")}</td>
            <td className='hidden lg:table-cell'>{item.phone}</td>
            <td className='hidden lg:table-cell'>{item.address}</td>
            <td>
                <div className='flex items-center gap-3'>
                    {
                        role === "admin" &&
                        <>
                            <FormContainer table='parent' type='update' data={item} />
                            <FormContainer table='parent' type='delete' id={item.id} />
                        </>
                    }

                </div>
            </td>
        </tr>
    )


    const columns = [
        {
            header: "Info",
            accessor: "info"
        },
        {
            header: "Student Names",
            accessor: "students",
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
        ...(role === "admin" ? [{
            header: "Actions",
            accessor: "actions",
        }] : [])
    ];
    // URL params condations
    const query: Prisma.ParentWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {

                switch (key) {
                    case "search":
                        query.name = { contains: value, mode: "insensitive" }
                        break
                }

            }
        }
    }

    const [data, count] = await prisma.$transaction([
        prisma.parent.findMany({
            where: query,
            include: {
                students: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.parent.count({ where: query })
    ]);

    return (
        <div className='bg-white rounded-md p-4 flex-1 m-4'>
            {/* Top */}
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold hidden md:inline-block'>All Parents</h1>
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
                            role === "admin" && <FormContainer table='parent' type='create' />
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

export default ParentList;
