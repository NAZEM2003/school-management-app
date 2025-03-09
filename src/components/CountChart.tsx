"use client"
import Image from 'next/image';
import React from 'react';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';

const CountChart = ({ boys, girls }: { boys: number; girls: number; }) => {

    const data = [
        {
            name: 'Total',
            count: boys + girls,
            fill: '#fff',
        },
        {
            name: 'Girls',
            count: girls,
            fill: '#fae27c',
        },
        {
            name: 'Boys',
            count: boys,
            fill: '#c3ebfa',
        }
    ];

    return (
        <div className='w-full h-[70%] relative'>
            <ResponsiveContainer>
                <RadialBarChart cx="50%" cy="50%" innerRadius="40%" outerRadius="100%" barSize={32} data={data}>
                    <RadialBar
                        background
                        dataKey="count"
                    />
                </RadialBarChart>
            </ResponsiveContainer>
            <Image className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2' src="/maleFemale.png" width={50} height={50} alt='male female' />
        </div>
    );
}

export default CountChart;
