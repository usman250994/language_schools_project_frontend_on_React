import httpRequest from './config/HttpRequest';
import { TimeTable } from './school';
import { User } from './user';

export type UserAttendance = {
  id: string;
  fullName?: string;
  status: boolean;
};

export enum AttendanceStatus {
  NOT_MARKED = 'NOT_MARKED',
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
}

export function createUserAttendance(students: UserAttendance[], classroomId: string | undefined): Promise<boolean> {
  const data = { students, classroomId };

  return httpRequest.request({
    url: '/attendance',
    method: 'post',
    data,
  });
}

export function updateUserAttendance(
  students: UserAttendance[],
  classroomId: string| undefined,
  dateSelected: number| undefined
): Promise<boolean> {
  const data = {
    students,
    classroomId,
    dateSelected,
  };

  return httpRequest.request(
    {
      url: '/attendance',
      method: 'put',
      data,
    }
  );
}

export function getUserAttendance(
  students: UserAttendance[],
  classroomId:
    | string
    | undefined,
  dateSelected: number
): Promise<boolean> {
  const data = {
    students,
    classroomId,
    dateSelected,
  };

  return httpRequest.request(
    {
      url: '/attendance',
      method: 'get',
      data,
    }
  );
}

type UserWithAttendance = User & { attendance: StudentAttendance[] }

export type ClassAttendanceTimeTable = { timeTable: TimeTable; students: UserWithAttendance[] }

export function getClassroomTimeTable(classroomId: string): Promise<ClassAttendanceTimeTable>{
  return httpRequest.request({ url: `/attendance/classroom/${classroomId}`, method: 'get' });
}

export type StudentAttendance = {
  studentId: string;
  status: AttendanceStatus;
  attendanceDate: Date;
}

export function markClassAttendance(classroomId: string, attendanceStatuses: StudentAttendance[]): Promise<ClassAttendanceTimeTable>{
  return httpRequest.request({ url: `/attendance/classroom/${classroomId}`, method: 'post', data: { attendanceStatuses } });
}
