"use client"
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AttendanceChart = ({ data }: { data: { name: string, present: number, absent: number }[]; }) => {
    return (
        <ResponsiveContainer width="100%" height="90%">
            <BarChart
                width={500}
                height={300}
                data={data}
                barSize={20}
            >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke='#ddd' />
                <XAxis dataKey="name" axisLine={false} tick={{ fill: "#b1b4b9" }} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: "10px", borderColor: "lightgray" }} />
                <Legend
                    align='left'
                    verticalAlign='top'
                    wrapperStyle={{ paddingBottom: "40px", paddingTop: "20px" }} />
                <Bar
                    legendType='circle'
                    dataKey="present"
                    fill="#fae27c"
                    radius={[10, 10, 0, 0]}
                />
                <Bar
                    legendType='circle'
                    dataKey="absent"
                    fill="#c3ebfa"
                    radius={[10, 10, 0, 0]}
                />
            </BarChart>
        </ResponsiveContainer>
    );
}

export default AttendanceChart;
