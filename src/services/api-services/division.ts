import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';

export type CreateDivisionRequest = {
  name: string;
  amount: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  day: string;
};

export type Division = {
  id: string;
  name: string;
  amount: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  day: string;
};

export function createDivision(
  data: CreateDivisionRequest
): Promise<Division> {
  return httpRequest.request({
    url: '/divisions',
    method: 'post',
    data,
  });
}

export function listDivisions(
  offset: number,
  limit: number,
  keyword: string,
  editClassroomId?: string,
): Promise<ListResponse<Division>> {
  if (!editClassroomId) {
    return httpRequest.request({
      url: `/divisions?offset=${offset}&limit=${limit}$name=${keyword}`,
      method: 'get',
    });
  }

  return httpRequest.request({
    url: `/divisions/classroom/${editClassroomId}?offset=${offset}&limit=${limit}$name=${keyword}`,
    method: 'get',
  });
}

export function addDivisionInClassroom(
  data: {
    classroomId: string;
    divisionId: string;
  }
): Promise<ListResponse<Division>> {
  return httpRequest.request({
    url: '/divisions/classroom',
    data,
    method: 'put',
  });
}
