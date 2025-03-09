"use client"

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

type ValuePiece = Date | null;

type Value = ValuePiece | [ValuePiece, ValuePiece];

const EventCalendar = () => {
    const [value, OnChange] = useState<Value>(new Date());
    const router = useRouter();

    useEffect(() => {
        if (value instanceof Date) {
            router.push(`?date=${value.toLocaleDateString("en-US")}`);
        }
    }, [value, router]);

    return <Calendar value={value} onChange={OnChange}/>;
}

export default EventCalendar;
