import httpRequest from "./config/HttpRequest";

export type UserAttendance = {
  id: string;
  fullName?: string;
  status: boolean;
};

export function createUserAttendance(
  students: UserAttendance[],
  classroomId:
    | string
    | undefined
): Promise<boolean> {
  const data = {
    students,
    classroomId,
  };
  return httpRequest.request(
    {
      url: "/attendance",
      method: "post",
      data,
    }
  );
}

export function updateUserAttendance(
  students: UserAttendance[],
  classroomId:
    | string
    | undefined,
  dateSelected:
    | number
    | undefined
): Promise<boolean> {
  const data = {
    students,
    classroomId,
    dateSelected,
  };
  return httpRequest.request(
    {
      url: "/attendance",
      method: "put",
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
      url: "/attendance",
      method: "get",
      data,
    }
  );
}
