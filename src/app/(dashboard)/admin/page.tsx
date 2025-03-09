import Announcements from '@/components/Announcements';
import AttendanceChartContainer from '@/components/AttendanceChartContainer';
import CountChartContainer from '@/components/CountChartContainer';
import EventCalendarContainer from '@/components/EventCalendarContainer';
import FinanceChart from '@/components/FinanceChart';
import UserCard from '@/components/UserCard';
import React from 'react';

const AdminPage = ({ searchParams }: { searchParams: { [keys: string]: string | undefined } }) => {
    return (
        <div className='p-4 flex gap-4 flex-col md:flex-row h-screen'>

            {/* left || top */}
            <div className='w-ful lg:w-2/3 flex flex-col gap-8'>

                {/* user Cards */}
                <div className='flex justify-between gap-4 flex-wrap'>
                    <UserCard type='admin' />
                    <UserCard type='teacher' />
                    <UserCard type='student' />
                    <UserCard type='parent' />
                </div>
                {/* Charts */}
                {/* middle Charts */}
                <div className='flex flex-col lg:flex-row gap-5'>
                    <div className='w-full lg:w-1/3 h-[450px]'>
                        <CountChartContainer />
                    </div>
                    <div className='w-full lg:w-2/3 h-[450px]'>
                        <AttendanceChartContainer />
                    </div>
                </div>
                {/* Bottom Chart */}
                <div className='w-full h-[500px]'>
                    <FinanceChart />
                </div>

            </div>
            {/* right || bottom */}
            <div className='w-full lg:w-1/3 flex flex-col gap-8'>
                <EventCalendarContainer searchParams={searchParams}/>
                <Announcements />
            </div>
        </div>
    );
}

export default AdminPage;
