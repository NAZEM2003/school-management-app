"use server"

import { AnnouncementSchema, AssignmentSchema, ClassSchema, EventSchema, ExamSchema, LessonSchema, ParentSchema, ResultSchema, StudentSchema, SubjectSchema, TeacherSchema } from "./formValidationSchemas";
import prisma from "./prisma";
import { clerkClient } from "@clerk/nextjs/server";
import { getUserData } from "./utils";
import { Day } from "@prisma/client";

export const createSubject = async (currentState: { success: boolean; error: boolean }, data: SubjectSchema) => {
    try {

        await prisma.subject.create({
            data: {
                name: data.name,
                teachers: {
                    connect: data.teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        });


        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateSubject = async (currentState: { success: boolean; error: boolean }, data: SubjectSchema) => {
    console.log(data);

    try {
        await prisma.subject.update({
            where: {
                id: data.id
            },
            data: {
                name: data.name,
                teachers: {
                    set: data.teachers.map(teacherId => ({ id: teacherId }))
                }
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteSubject = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.subject.delete({
            where: {
                id: parseInt(id)
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}


export const createClass = async (currentState: { success: boolean; error: boolean }, data: ClassSchema) => {
    try {
        await prisma.class.create({
            data
        });


        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateClass = async (currentState: { success: boolean; error: boolean }, data: ClassSchema) => {
    try {
        await prisma.class.update({
            where: {
                id: data.id
            },
            data
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteClass = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.class.delete({
            where: {
                id: parseInt(id)
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}


export const createTeacher = async (currentState: { success: boolean; error: boolean }, data: TeacherSchema) => {
    try {
        const clerk = await clerkClient();
        const user = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" }
        })

        await prisma.teacher.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    connect: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId)
                    }))
                }
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateTeacher = async (currentState: { success: boolean; error: boolean }, data: TeacherSchema) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        const clerk = await clerkClient();
        await clerk.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" }
        })

        await prisma.teacher.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                subjects: {
                    set: data.subjects?.map((subjectId: string) => ({
                        id: parseInt(subjectId)
                    }))
                }
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteTeacher = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(id)
        await prisma.teacher.delete({
            where: {
                id: id
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}


export const createStudent = async (currentState: { success: boolean; error: boolean }, data: StudentSchema) => {
    try {
        const classItem = await prisma.class.findUnique({
            where: {
                id: data.classId
            },
            include: { _count: { select: { students: true } } }
        });

        if (classItem && classItem.capacity === classItem._count.students) {
            return { success: false, error: true };
        }
        const clerk = await clerkClient();
        const user = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "student" }
        })

        await prisma.student.create({
            data: {
                id: user.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId || undefined
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateStudent = async (currentState: { success: boolean; error: boolean }, data: StudentSchema) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        const clerk = await clerkClient();
        await clerk.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "teacher" }
        })

        await prisma.student.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data.email,
                phone: data.phone,
                address: data.address,
                img: data.img,
                bloodType: data.bloodType,
                sex: data.sex,
                birthday: data.birthday,
                gradeId: data.gradeId,
                classId: data.classId,
                parentId: data.parentId
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteStudent = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(id)
        await prisma.student.delete({
            where: {
                id: id
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}



export const createExam = async (currentState: { success: boolean; error: boolean }, data: ExamSchema) => {
    const { role, userId } = await getUserData();
    try {
        const teacherLesson = await prisma.lesson.findFirst({
            where: {
                id: data.lessonId,
                teacherId: userId!
            }
        });
        if (role === "teacher" && !teacherLesson) {
            return { success: false, error: true };
        }

        await prisma.exam.create({ data });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateExam = async (currentState: { success: boolean; error: boolean }, data: ExamSchema) => {
    const { role, userId } = await getUserData();
    try {
        await prisma.exam.update({
            where: {
                id: data.id,
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {})
            },
            data
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteExam = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string;
    const { role, userId } = await getUserData();

    try {
        await prisma.exam.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {})
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}


export const createAssignment = async (currentState: { success: boolean; error: boolean }, data: AssignmentSchema) => {
    const { role, userId } = await getUserData();
    try {
        const teacherLesson = await prisma.lesson.findFirst({
            where: {
                id: data.lessonId,
                teacherId: userId!
            }
        });
        if (role === "teacher" && !teacherLesson) {
            return { success: false, error: true };
        }
        await prisma.assignment.create({ data });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}

export const updateAssignment = async (currentState: { success: boolean; error: boolean }, data: AssignmentSchema) => {
    const { role, userId } = await getUserData();
    try {
        await prisma.assignment.update({
            where: {
                id: data.id,
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {})
            },
            data
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteAssignment = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string;
    const { role, userId } = await getUserData();

    try {
        await prisma.assignment.delete({
            where: {
                id: parseInt(id),
                ...(role === "teacher" ? { lesson: { teacherId: userId! } } : {})
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}


export const createParent = async (currentState: { success: boolean; error: boolean }, data: ParentSchema) => {
    try {
        data.students?.map(async (studentId) => {
            const isStudentIdCorrect = await prisma.student.findUnique({
                where: {
                    id: studentId
                },
                select: {
                    id: true,
                    name: true
                }
            });
            if (!isStudentIdCorrect) {
                return { success: false, error: true };
            }
        });
        const clerk = await clerkClient();
        const ParentItem = await clerk.users.createUser({
            username: data.username,
            password: data.password,
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "parent" }
        })

        data.students?.map(async (studentId) => {
            try {
                await prisma.student.update({
                    where: {
                        id: studentId
                    },
                    data: {
                        parentId: ParentItem.id
                    }
                });
            } catch (error) {
                console.log(error);
                return { success: false, error: true };
            }

        });

        await prisma.parent.create({
            data: {
                id: ParentItem.id,
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data?.email,
                phone: data.phone,
                address: data.address,
                students: {
                    connect: data.students?.map((id) => ({ id }))
                }
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const updateParent = async (currentState: { success: boolean; error: boolean }, data: ParentSchema) => {
    if (!data.id) {
        return { success: false, error: true };
    }
    try {
        const clerk = await clerkClient();
        await clerk.users.updateUser(data.id, {
            username: data.username,
            ...(data.password !== "" && { password: data.password }),
            firstName: data.name,
            lastName: data.surname,
            publicMetadata: { role: "parent" }
        });


        data.students?.map(async (studentId) => {
            try {
                await prisma.student.update({
                    where: {
                        id: studentId
                    },
                    data: {
                        parentId: data.id
                    }
                });
            } catch (error) {
                console.log(error);
                return { success: false, error: true };
            }

        });

        await prisma.parent.update({
            where: {
                id: data.id
            },
            data: {
                ...(data.password !== "" && { password: data.password }),
                username: data.username,
                name: data.name,
                surname: data.surname,
                email: data?.email,
                phone: data.phone,
                address: data.address,
                students: {
                    set: data.students?.map((id) => ({ id }))
                }
            }
        });

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};
export const deleteParent = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        const clerk = await clerkClient();
        await clerk.users.deleteUser(id)
        await prisma.student.delete({
            where: {
                id: id
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
};



export const createLesson = async (currentState: { success: boolean; error: boolean }, data: LessonSchema) => {
    try {
        const teacherData = await prisma.class.findUnique({
            where: {
                id: parseInt(data.classId)
            },
            select: {
                supervisorId: true
            }
        });

        await prisma.lesson.create({
            data: {
                name: data.name,
                day: data.day as Day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: parseInt(data.subjectId),
                classId: parseInt(data.classId),
                teacherId: teacherData?.supervisorId!

            }
        });


        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateLesson = async (currentState: { success: boolean; error: boolean }, data: LessonSchema) => {
    try {
        const teacherData = await prisma.class.findUnique({
            where: {
                id: parseInt(data.classId)
            },
            select: {
                supervisorId: true
            }
        });
        await prisma.lesson.update({
            where: {
                id: data.id
            },
            data: {
                teacherId: teacherData?.supervisorId!,
                name: data.name,
                day: data.day as Day,
                startTime: data.startTime,
                endTime: data.endTime,
                subjectId: parseInt(data.subjectId),
                classId: parseInt(data.classId),

            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteLesson = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.lesson.delete({
            where: {
                id: parseInt(id)
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}



export const createResult = async (currentState: { success: boolean; error: Boolean }, data: ResultSchema) => {
    try {
        if (!data.assignmentId && !data.examId) {
            return { success: false, error: true };
        };
        const isStudentExist = await prisma.student.findUnique({
            where: {
                id: data.studentId
            },
            select: {
                id: true,
                name: true
            }
        });
        const assessment = data.examId ? await prisma.exam.findUnique({ where: { id: parseInt(data.examId) } }) : await prisma.assignment.findUnique({ where: { id: parseInt(data.assignmentId!) } });

        if (!isStudentExist || !assessment) {
            return { success: false, error: true };
        }

        data.examId ? await prisma.result.create({
            data: {
                score: parseInt(data.score),
                studentId: data.studentId,
                examId: parseInt(data.examId!) || null
            }
        }) : await prisma.result.create({
            data: {
                score: parseInt(data.score),
                studentId: data.studentId,
                assignmentId: parseInt(data.assignmentId!)
            }
        })

        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateResult = async (currentState: { success: boolean; error: boolean }, data: ResultSchema) => {
    try {
        if (!data.assignmentId && !data.examId) {
            return { success: false, error: true };
        };
        const isStudentExist = await prisma.student.findUnique({
            where: {
                id: data.studentId
            },
            select: {
                id: true,
                name: true
            }
        });
        const assessment = data.examId ? await prisma.exam.findUnique({ where: { id: parseInt(data.examId) } }) : await prisma.assignment.findUnique({ where: { id: parseInt(data.assignmentId!) } });

        if (!isStudentExist || !assessment) {
            return { success: false, error: true };
        }

        await prisma.result.update({
            where: {
                id: data.id
            },
            data: {
                score: parseInt(data.score),
                studentId: data.studentId,
                assignmentId: parseInt(data.assignmentId!) || null,
                examId: parseInt(data.examId!) || null
            }
        })

        // revalidatePath("/list/subjects");
        return { success: true, error: false, message: "OK" };
    } catch (err) {
        console.log(err);
        return { success: false, error: true, message: err };
    }
}
export const deleteResult = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string
    try {
        await prisma.result.delete({
            where: {
                id: parseInt(id)
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}


export const createEvent = async (currentState: { success: boolean; error: boolean }, data: EventSchema) => {
    try {
        await prisma.event.create({
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                classId: parseInt(data.classId!) || null
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateEvent = async (currentState: { success: boolean; error: boolean }, data: EventSchema) => {

    try {

        await prisma.event.update({
            where: {
                id: data.id
            },
            data: {
                title: data.title,
                description: data.description,
                startTime: data.startTime,
                endTime: data.endTime,
                classId: parseInt(data.classId!) || null
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteEvent = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string;
    try {
        await prisma.event.delete({
            where: {
                id: parseInt(id),
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}



export const createAnnouncement = async (currentState: { success: boolean; error: boolean }, data: AnnouncementSchema) => {
    try {
        await prisma.announcement.create({
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: parseInt(data.classId!) || null
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const updateAnnouncement = async (currentState: { success: boolean; error: boolean }, data: AnnouncementSchema) => {

    try {

        await prisma.announcement.update({
            where: {
                id: data.id
            },
            data: {
                title: data.title,
                description: data.description,
                date: data.date,
                classId: parseInt(data.classId!) || null
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
export const deleteAnnouncement = async (currentState: { success: boolean; error: boolean }, data: FormData) => {
    const id = data.get("id") as string;
    try {
        await prisma.announcement.delete({
            where: {
                id: parseInt(id),
            }
        });
        // revalidatePath("/list/subjects");
        return { success: true, error: false };
    } catch (err) {
        console.log(err);
        return { success: false, error: true };
    }
}
