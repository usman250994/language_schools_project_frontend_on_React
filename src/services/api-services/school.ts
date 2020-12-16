import queryString from 'query-string';

import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';

export type School = {
  id: string;
  email: string;
  name: string;
  address: string;
  phone: string;
  classrooms: Classroom[];
};

export type CreateSchoolRequest = {
  email: string;
  name: string;
  address: string;
  phone: string;
};

export function createSchool(data: CreateSchoolRequest): Promise<School> {
  return httpRequest.request({
    url: '/schools',
    method: 'post',
    data,
  });
}

export function listSchools(
  offset: number,
  limit: number,
  name = ''
): Promise<ListResponse<School>> {
  return httpRequest.request({
    url: `/schools?offset=${offset}&limit=${limit}&name=${name}`,
    method: 'get',
  });
}

export function editSchool(
  schoolId: string,
  data: CreateSchoolRequest
): Promise<void> {
  return httpRequest.request({
    url: `/schools/${schoolId}`,
    method: 'put',
    data,
  });
}

export function deleteSchool(schoolId: string): Promise<void> {
  return httpRequest.request({
    url: `/schools/${schoolId}`,
    method: 'delete',
  });
}

export type Classroom = {
  id: string;
  name: string;
  section: string;
};

export type CreateClassRequest = {
  name: string;
  section: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  day: string;
};

export enum Days {
  SUNDAY = 'SUNDAY',
  MONDAY = 'MONDAY',
  TUESDAY = 'TUESDAY',
  WEDNESDAY = 'WEDNESDAY',
  THURSDAY = 'THURSDAY',
  FRIDAY = 'FRIDAY',
  SATURDAY = 'SATURDAY',
}

export const DaysText: { [x in Days]: string } = {
  SUNDAY: 'Sunday',
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
};

export const DaysIndexed = Object.keys(DaysText);

export function createClassroom(
  schoolId: string,
  data: CreateClassRequest
): Promise<Classroom> {
  return httpRequest.request({
    url: `/classrooms/schools/${schoolId}`,
    method: 'post',
    data,
  });
}

export function editClassroom(classroomId: string, schoolId: string, data: CreateClassRequest): Promise<Classroom> {
  return httpRequest.request({
    url: `/classrooms/${classroomId}/schools/${schoolId}`,
    method: 'put',
    data,
  });
}

export function deleteClassroom(classroomId: string): Promise<void> {
  return httpRequest.request({
    url: `/classrooms/${classroomId}`,
    method: 'delete',
  });
}

export function deleteClassroomFromUser(
  classroomId: string | undefined,
  userId: string
): Promise<void> {
  return httpRequest.request({
    url: `/classrooms/${classroomId}/users/${userId}`,
    method: 'delete',
  });
}

export function listClassrooms(
  offset: number,
  limit: number,
  name: string
): Promise<ListResponse<Classroom>> {
  return httpRequest.request({
    url: `/classrooms?offset=${offset}&limit=${limit}&name=${name}`,
    method: 'get',
  });
}

export type TimeTable = {
  day: Days;
  endDate: string;
  endTime: string;
  startDate: string;
  startTime: string;
}

export type ClassRoomWithTimeTable = Classroom & Partial<{ timeTable: TimeTable }>

export function listSchoolsClassrooms(
  schoolId: string,
  offset: number,
  limit: number,
  name: string
): Promise<ListResponse<ClassRoomWithTimeTable>> {
  return httpRequest.request({
    url: `/classrooms/schools/${schoolId}?offset=${offset}&limit=${limit}&name=${name}`,
    method: 'get',
  });
}

export function listClassroomsByUser(
  userId: string,
  offset: number,
  limit: number
): Promise<ListResponse<Classroom>> {
  return httpRequest.request({
    url: `/classrooms/users/${userId}?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export function addClassToUser(
  classRoomId: string | undefined,
  userId: string
): Promise<ListResponse<Classroom>> {
  return httpRequest.request({
    url: `/classrooms/${classRoomId}/users/${userId}`,
    method: 'post',
  });
}
