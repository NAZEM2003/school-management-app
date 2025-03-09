import { auth } from "@clerk/nextjs/server";

export const getUserData = async () => {
    const { sessionClaims, userId } = await auth();
    const role = (sessionClaims?.metadata as { role: string })?.role;
    return { userId, role };
};

const currentWorkWeek = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);

    if (dayOfWeek === 0) {
        startOfWeek.setDate(today.getDate() + 1);
    } else if (dayOfWeek === 6) {
        startOfWeek.setDate(today.getDate() + 2);
    } else {
        startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
    };
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 4);
    endOfWeek.setHours(23, 59, 59, 999);

    return { startOfWeek, endOfWeek };
}

export const adjustScheduleToCurrentWeek = (lessons: { title: string, start: Date, end: Date }[]): { title: string, start: Date, end: Date }[] => {
    const { startOfWeek } = currentWorkWeek();
    return lessons.map(lesson => {
        const lessonDayOfWeek = lesson.start.getDay();
        const daysFromMonday = lessonDayOfWeek === 0 ? 6 : lessonDayOfWeek - 1;
        const adjusteStartDate = new Date(startOfWeek);
        adjusteStartDate.setDate(startOfWeek.getDate() + daysFromMonday);
        adjusteStartDate.setHours(lesson.start.getHours(), lesson.start.getMinutes(), lesson.start.getSeconds());
        const adjusteEndtDate = new Date(adjusteStartDate);
        adjusteEndtDate.setHours(lesson.end.getHours(), lesson.end.getMinutes(), lesson.end.getSeconds());
        return {
            title: lesson.title,
            start: adjusteStartDate,
            end: adjusteEndtDate
        }
    })
};