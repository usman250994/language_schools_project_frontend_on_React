import httpRequest from './config/HttpRequest';
import { ListResponse } from './interfaces';

export type UploadAssignmentToClassRequest = {
  classId: string;
  files: File[];
}

export async function uploadAssignmentToClassroom(data: UploadAssignmentToClassRequest): Promise<void> {
  const formData = new FormData();

  data.files.forEach(file => {
    formData.append('files', file);
  });

  return httpRequest.request({
    url: `/classrooms/${data.classId}/assignments/`,
    method: 'post',
    data: formData,
    header: { 'Content-type': 'multipart/form-data' },
  });
}

export type Assignment = {
  key: string;
  id: string;
  classId: string;
}

export function listAssignments(classId: string, offset: number, limit: number): Promise<ListResponse<Assignment>> {
  return httpRequest.request({
    url: `/classrooms/${classId}/assignments?offset=${offset}&limit=${limit}`,
    method: 'get',
  });
}
