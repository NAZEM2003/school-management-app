"use client"
import Image from 'next/image';
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'mar',
        income: 4000,
        expense: 2400,
    },
    {
        name: 'apr',
        income: 3000,
        expense: 1398,
    },
    {
        name: 'may',
        income: 2000,
        expense: 9800,
    },
    {
        name: 'jun',
        income: 2780,
        expense: 3908,
    },
    {
        name: 'jul',
        income: 1890,
        expense: 4800,
    },
    {
        name: 'aug',
        income: 2390,
        expense: 3800,
    }
];


const FinanceChart = () => {
    return (
        <div className='bg-white rounded-xl w-full h-full p-2'>
            <div className='flex justify-between items-center'>
                <h1 className='text-lg font-semibold'>Finance</h1>
                <Image src="/moreDark.png" width={20} height={20} alt='more' />
            </div>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                >
                    <CartesianGrid strokeDasharray="3 3" stroke='#ddd' />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tick={{ fill: "#b1b4b9" }}
                        tickLine={false}
                        tickMargin={10} />
                    <YAxis
                        axisLine={false}
                        tick={{ fill: "#b1b4b9" }}
                        tickLine={false}
                        tickMargin={10} />
                    <Tooltip />
                    <Legend
                        align='center'
                        verticalAlign='top'
                        wrapperStyle={{ paddingBottom: "20px", paddingTop: "10px" }} />
                    <Line type="monotone" dataKey="income" stroke="#fae27c" strokeWidth={4} />
                    <Line type="monotone" dataKey="expense" stroke="#c3ebfa" strokeWidth={4} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}

export default FinanceChart;
