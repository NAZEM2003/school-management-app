import { z } from "zod";

export const subjectSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: 'Subject Name is Required' }),
    teachers: z.array(z.string()),
});
export type SubjectSchema = z.infer<typeof subjectSchema>;

export const classSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: 'Class Name is Required' }),
    capacity: z.coerce.number().min(1, { message: "Capacity is Required" }),
    gradeId: z.coerce.number().min(1, { message: "Grade is Required" }),
    supervisorId: z.coerce.string().optional()
});
export type ClassSchema = z.infer<typeof classSchema>;

export const teacherSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long!' })
        .max(20, { message: 'Username must be at most 20 characters long!' }),
    email: z.string().email({ message: "invalid Email Address!" }).optional().or(z.literal("")),
    password: z.string()
        .min(8, { message: 'Password must be at least 4 characters long!' })
        .max(16, { message: 'Password must be at most 16 characters long!' })
        .optional()
        .or(z.literal("")),
    name: z.string().min(1, { message: 'First name is Required!' }),
    surname: z.string().min(1, { message: 'Last name is Required!' }),
    phone: z.string().optional(),
    bloodType: z.string().min(1, { message: 'Blood Type is Required!' }),
    address: z.string().min(1, { message: "Address is Required!" }),
    birthday: z.coerce.date({ message: 'Birthday is Required!' }),
    sex: z.enum(["MALE", "FEMALE"], { message: "sex is Required" }),
    img: z.string().optional(),
    subjects: z.array(z.string()).optional()
});
export type TeacherSchema = z.infer<typeof teacherSchema>;


export const studentSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long!' })
        .max(20, { message: 'Username must be at most 20 characters long!' }),
    email: z.string().email({ message: "invalid Email Address!" }).optional().or(z.literal("")),
    password: z.string()
        .min(8, { message: 'Password must be at least 4 characters long!' })
        .max(16, { message: 'Password must be at most 16 characters long!' })
        .optional()
        .or(z.literal("")),
    name: z.string().min(1, { message: 'First name is Required!' }),
    surname: z.string().min(1, { message: 'Last name is Required!' }),
    phone: z.string().optional(),
    bloodType: z.string().min(1, { message: 'Blood Type is Required!' }),
    address: z.string().min(1, { message: "Address is Required!" }),
    birthday: z.coerce.date({ message: 'Birthday is Required!' }),
    sex: z.enum(["MALE", "FEMALE"], { message: "sex is Required" }),
    img: z.string().optional(),
    gradeId: z.coerce.number().min(1, { message: "Grade is Required" }),
    classId: z.coerce.number().min(1, { message: "Class is Required" }),
    parentId: z.string().min(1, { message: "Parent ID is Required" }).optional().or(z.literal("")),
});
export type StudentSchema = z.infer<typeof studentSchema>;


export const examSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: 'Exam Title is Required' }),
    startTime: z.coerce.date({ message: "Start Time is Required" }),
    endTime: z.coerce.date({ message: "End Time is Required" }),
    lessonId: z.coerce.number({ message: "End Time is Required" }),
});
export type ExamSchema = z.infer<typeof examSchema>;

export const assignmentSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: 'Exam Title is Required' }),
    startDate: z.coerce.date({ message: "Start Time is Required" }),
    dueDate: z.coerce.date({ message: "End Time is Required" }),
    lessonId: z.coerce.number({ message: "End Time is Required" }),
});
export type AssignmentSchema = z.infer<typeof assignmentSchema>;


export const parentSchema = z.object({
    id: z.string().optional(),
    username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long!' })
        .max(20, { message: 'Username must be at most 20 characters long!' }),
    email: z.string().email({ message: "invalid Email Address!" }).optional().or(z.literal("")),
    password: z.string()
        .min(8, { message: 'Password must be at least 4 characters long!' })
        .max(16, { message: 'Password must be at most 16 characters long!' })
        .optional()
        .or(z.literal("")),
    name: z.string().min(1, { message: 'First name is Required!' }),
    surname: z.string().min(1, { message: 'Last name is Required!' }),
    address: z.string().min(1, { message: 'Address is Required!' }),
    phone: z.string().min(1, { message: "Phone is Required" }),
    students: z.array(z.string()).optional(),
});
export type ParentSchema = z.infer<typeof parentSchema>;

export const lessonSchema = z.object({
    id: z.coerce.number().optional(),
    name: z.string().min(1, { message: 'Lesson Name is Required' }),
    day: z.coerce.string(),
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    subjectId: z.string().min(1, { message: "Subject is Required" }),
    classId: z.string().min(1, { message: "Class is Required" }),
});
export type LessonSchema = z.infer<typeof lessonSchema>;

export const resultSchema = z.object({
    id: z.coerce.number().optional(),
    score: z.string().min(0, { message: 'result score is Required' }),
    examId: z.coerce.string().optional().or(z.literal("")),
    assignmentId: z.coerce.string().optional().or(z.literal("")),
    studentId: z.coerce.string().min(1, { message: "Exam is Required" }),
});
export type ResultSchema = z.infer<typeof resultSchema>;


export const eventSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title is Required" }),
    startTime: z.coerce.date({ message: "Start Time is Required" }),
    endTime: z.coerce.date({ message: "End Time is Required" }),
    classId: z.coerce.string().optional().or(z.literal("")),
    description: z.string().min(1, { message: "Description is Required" })
});
export type EventSchema = z.infer<typeof eventSchema>;


export const announcementSchema = z.object({
    id: z.coerce.number().optional(),
    title: z.string().min(1, { message: "Title is Required" }),
    date: z.coerce.date({ message: "Start Time is Required" }),
    classId: z.coerce.string().optional().or(z.literal("")),
    description: z.string().min(1, { message: "Description is Required" })
});
export type AnnouncementSchema = z.infer<typeof announcementSchema>;

