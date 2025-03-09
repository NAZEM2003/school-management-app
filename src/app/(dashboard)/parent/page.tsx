import Announcements from "@/components/Announcements";
import BigCalendarContainer from "@/components/BigCalendarContainer";
import EventCalendar from "@/components/EventCalendar";
import EventCalendarContainer from "@/components/EventCalendarContainer";
import prisma from "@/lib/prisma";
import { getUserData } from "@/lib/utils";

const ParentPage = async ({ searchParams }: { searchParams: { [keys: string]: string | undefined } }) => {
    const { userId } = await getUserData();

    const students = await prisma.student.findMany({
        where: {
            parentId: userId
        }
    });

    return (
        <div className="flex-1 p-4 gap-4 flex flex-col lg:flex-row">
            {/* LEFT */}
            {
                students.length > 0 ?
                    students.map((student) => (
                        <div key={student.id} className="w-full lg:w-2/3">
                            <div className="h-full bg-white p-4 rounded-md">
                                <h1 className="text-xl font-semibold">Schedule ({student.name + "" + student.surname})</h1>
                                <BigCalendarContainer type="classId" id={student.classId} />
                            </div>
                        </div>
                    ))
                    : ""
            }
            {/* RIGHT */}
            <div className="w-full lg:w-1/3 flex flex-col gap-8">
                <EventCalendarContainer searchParams={searchParams} />
                <Announcements />
            </div>
        </div>
    );
};

export default ParentPage;