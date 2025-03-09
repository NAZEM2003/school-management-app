import React from 'react';

const Table = ({
    columns,
    renderRow,
    data
}: {
    columns: { header: string, accessor: string, className?: string }[];
    renderRow: (item: any) => React.ReactNode;
    data: any[]
}) => {


    return (
        <table className='w-full mt-10'>
            <thead>
                <tr className='text-gray-500 text-left text-sm'>
                    {
                        columns.map(col => (
                            <th className={col.className} key={col.accessor}>{col.header}</th>
                        ))
                    }
                </tr>
            </thead>
            <tbody>
                {
                    data.map(item => renderRow(item))
                }
            </tbody>
        </table>
    );
}

export default Table;
