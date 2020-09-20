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
}

export type CreateSchoolRequest = {
  email: string;
  name: string;
  address: string;
  phone: string;
}

export function createSchool(data: CreateSchoolRequest): Promise<School> {
  return httpRequest.request({
    url: '/schools',
    method: 'post',
    data,
  });
}

export function listSchools(offset: number, limit: number, name = ''): Promise<ListResponse<School>> {
  return httpRequest.request({
    url: `/schools?offset=${offset}&limit=${limit}&name=${name}`,
    method: 'get',
  });
}

export function editSchool(schoolId: string, data: CreateSchoolRequest): Promise<void> {
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
}

export type CreateClassRequest = {
  name: string;
  section: string;
}

export function createClassroom(schoolId: string, data: CreateClassRequest): Promise<Classroom> {
  return httpRequest.request({
    url: `/classrooms/schools/${schoolId}`,
    method: 'post',
    data,
  });
}

export function deleteClassroom(classroomId: string): Promise<void> {
  return httpRequest.request({
    url: `/classrooms/${classroomId}`,
    method: 'delete',
  });
}

export function deleteClassroomFromUser(classroomId: string, userId: string): Promise<void> {
  return httpRequest.request({
    url: `/classrooms/${classroomId}/users/${userId}`,
    method: 'delete',
  });
}

export function listClassrooms(offset: number, limit: number, name: string): Promise<ListResponse<Classroom>> {
  return httpRequest.request({
    url: `/classrooms?offset=${offset}&limit=${limit}&name=${name}`,
    method: 'get',
  });
}

export function listSchoolsClassrooms(schoolId: string, offset: number, limit: number, name: string): Promise<ListResponse<Classroom>> {
  return httpRequest.request({
    url: `/classrooms/schools/${schoolId}?offset=${offset}&limit=${limit}&name=${name}`,
    method: 'get',
  });
}

export function listClassroomsByUser(userId: string, offset: number, limit: number): Promise<ListResponse<Classroom>> {
  return httpRequest.request({
    url: `/classrooms/users/${userId}?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}

export function addClassToUser(classRoomId: string, userId: string): Promise<ListResponse<Classroom>> {
  return httpRequest.request({
    url: `/classrooms/${classRoomId}/users/${userId}`,
    method: 'post',
  });
}
