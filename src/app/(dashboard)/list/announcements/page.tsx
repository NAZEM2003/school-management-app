import Pagination from '@/components/Pagination';
import Table from '@/components/Table';
import TableSearch from '@/components/TableSearch';
import Image from 'next/image';
import React from 'react';
import { Announcement, Class, Prisma } from '@prisma/client';
import prisma from '@/lib/prisma';
import { ITEM_PER_PAGE } from '@/lib/settings';
import { getUserData } from '@/lib/utils';
import FormContainer from '@/components/FormContainer';

type AnnnouncmentsList = Announcement & { class: Class };


const AnnnouncmentList = async ({ searchParams }: { searchParams: { [key: string]: string | undefined } }) => {
    const { role, userId } = await getUserData();
    const { page, ...queryParams } = searchParams;
    const p = page ? parseInt(page) : 1;

    const renderRow = (item: AnnnouncmentsList) => (
        <tr key={item.id} className='border-b border-b-gray-200 even:bg-slate-50 text-sm hover:bg-customPurpleLight transition-all'>
            <td className='p-4'>
                <h2 className='font-semibold'>{item.title}</h2>
            </td>
            <td className='hidden sm:table-cell'>{item.class?.name || "_"}</td>
            <td className='hidden md:table-cell'>{new Intl.DateTimeFormat("en-US").format(item.date)}</td>
            <td>
                <div className='flex items-center gap-3'>

                    {
                        role === "admin" && (<>
                            <FormContainer table='announcement' type='update' data={item} />
                            <FormContainer table='announcement' type='delete' id={item.id} />
                        </>)
                    }

                </div>
            </td>
        </tr>
    );
    const columns = [
        {
            header: "Title",
            accessor: "title",
        },
        {
            header: "Class",
            accessor: "calss",
            className: "hidden sm:table-cell"
        },
        {
            header: "Date",
            accessor: "date",
            className: "hidden md:table-cell"
        },
        ...(role === "admin" ? [{
            header: "Actions",
            accessor: "actions",
        },] : [])

    ];

    // URL params condations
    const query: Prisma.AnnouncementWhereInput = {}
    if (queryParams) {
        for (const [key, value] of Object.entries(queryParams)) {
            if (value !== undefined) {
                switch (key) {
                    case "search":
                        query.title = { contains: value, mode: "insensitive" }
                        break
                }

            }
        }
    };

    // Role condations
    const roleCondations = {
        admin: { id: { not: undefined } },
        teacher: { lessons: { some: { teacherId: userId! } } },
        student: { students: { some: { id: userId! } } },
        parent: { students: { some: { parentId: userId! } } },
    };
    query.OR = [
        { classId: null },
        {
            class: roleCondations[role as keyof typeof roleCondations] || {}
        }]


    const [data, count] = await prisma.$transaction([
        prisma.announcement.findMany({
            where: query,
            include: {
                class: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (p - 1)
        }),
        prisma.announcement.count({ where: query })
    ]);



    return (
        <div className='bg-white rounded-md p-4 flex-1 m-4'>
            {/* Top */}
            <div className='flex items-center justify-between'>
                <h1 className='text-lg font-semibold hidden md:inline-block'>All Annnouncments</h1>
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
                            role === "admin" && <FormContainer table='announcement' type='create' />
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

export default AnnnouncmentList;
