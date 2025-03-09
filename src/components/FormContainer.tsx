import React from 'react';
import FormModal from './FormModal';
import prisma from '@/lib/prisma';
import { getUserData } from '@/lib/utils';
export type formContainerProps = {
    table: "teacher" |
    "student" |
    "parent" |
    "subject" |
    "classe" |
    "lesson" |
    "exam" |
    "assignment" |
    "result" |
    "attendance" |
    "event" |
    "announcement";
    type: "create" | "update" | "delete";
    data?: any;
    id?: number | string;
};

const FormContainer = async ({
    table,
    type,
    data,
    id
}: formContainerProps) => {
    let relatedData = {};
    const { role, userId } = await getUserData()

    if (type !== "delete") {
        switch (table) {
            case "subject":
                const subjectTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { teachers: subjectTeachers }
                break;
            case "classe":
                const classGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const classTeachers = await prisma.teacher.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { teachers: classTeachers, grades: classGrades }
                break;
            case "teacher":
                const teacherSubjects = await prisma.subject.findMany({
                    select: { id: true, name: true },
                });
                relatedData = { subjects: teacherSubjects }
                break;
            case "student":
                const studentGrades = await prisma.grade.findMany({
                    select: { id: true, level: true },
                });
                const studentClasses = await prisma.class.findMany({
                    include: { _count: { select: { students: true } } }
                });
                relatedData = { grades: studentGrades, classes: studentClasses }
                break;
            case "exam":
                const examLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: userId! } : {})
                    },
                    select: {
                        id: true,
                        name: true
                    }
                })
                relatedData = { lessons: examLessons }
                break;
            case "assignment":
                const assignmentLessons = await prisma.lesson.findMany({
                    where: {
                        ...(role === "teacher" ? { teacherId: userId! } : {})
                    },
                    select: {
                        id: true,
                        name: true
                    }
                })
                relatedData = { lessons: assignmentLessons }
                break;
            case "parent":
                relatedData = {}
                break;
            case "lesson":
                const lessonSubjects = await prisma.subject.findMany({
                    select: {
                        id: true,
                        name: true
                    }
                })
                const lessonClasses = await prisma.class.findMany({
                    select: {
                        id: true,
                        name: true,
                    }
                })
                relatedData = { subjects: lessonSubjects, classes: lessonClasses }
                break;
            case "event":
                const eventClasses = await prisma.class.findMany({
                    select: {
                        id: true,
                        name: true
                    }
                })
                relatedData = { classes: eventClasses }
                break;
            case "announcement":
                const announcementClasses = await prisma.class.findMany({
                    select: {
                        id: true,
                        name: true
                    }
                })
                relatedData = { classes: announcementClasses }
                break;
            default:
                break;
        }
    }
    return (
        <div>
            <FormModal table={table} type={type} id={id} data={data} relatedData={relatedData} />
        </div>
    );
}

export default FormContainer;
