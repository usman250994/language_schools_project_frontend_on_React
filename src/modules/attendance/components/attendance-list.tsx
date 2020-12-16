import { getDay, addDays, format, compareDesc, isEqual, parseISO } from 'date-fns';
import React, {useEffect, useState } from 'react';
import { Form, Table } from 'react-bootstrap';

import { getClassroomTimeTable, ClassAttendanceTimeTable, AttendanceStatus, StudentAttendance, markClassAttendance } from '../../../services/api-services/attendance';
import { DaysIndexed } from '../../../services/api-services/school';

import './attendance.scss';

interface AttendanceListProps {
	classId: string;
}

function AttendanceList(props: AttendanceListProps): JSX.Element {
  const { classId } = props;

  const [classroomAttendance, setClassroomAttendance] = useState<ClassAttendanceTimeTable>();
  const [error, setError] = useState(false);

  const [allTimeTableDays, setAllTimeTableDays] = useState<Date[]>();
  const [studentsStatuses, setStudentsStatuses] = useState<{ [x: string]: StudentAttendance[] }>();

  const fetcher = async (id: string): Promise<void> => {
    try {
      const _timeTable = await getClassroomTimeTable(id);

      setClassroomAttendance(_timeTable);

      const { timeTable: { startDate, endDate, day }, students } = _timeTable;

      const timeTableDateIndex = getDay(new Date(startDate));
      const diffInDay = DaysIndexed.findIndex(d => d === day) - timeTableDateIndex;

      let newStartDate = new Date(startDate);

      if (diffInDay > 0) {
        newStartDate = addDays(newStartDate, diffInDay);
      }
      if (diffInDay < 0) {
        newStartDate = addDays(newStartDate, 7 - Math.abs(diffInDay));
      }

      const dateArr: Date[] = [];

      while (compareDesc(newStartDate, new Date(endDate)) === 1) {
        dateArr.push(newStartDate);
        newStartDate = addDays(newStartDate, 7);
      }

      // console.log({ startDate });
      // console.log({ endDate });
      // console.log({ day });
      // console.log({ dateArr });

      setAllTimeTableDays(dateArr);

      if (students) {
        const studentsStatuses = students.reduce<{ [x: string]: StudentAttendance[] }>((acc, std) => {
          acc[std.id] = dateArr.map(timeDays => {
            let atStatus = AttendanceStatus.ABSENT;

            const foundStatus = std.attendance.find(at => at.studentId === std.id && isEqual(new Date(at.attendanceDate), new Date(timeDays)));

            if (foundStatus) {
              atStatus = foundStatus.status;
            }

            return {
              studentId: std.id,
              status: atStatus,
              attendanceDate: timeDays,
            };
          });

          return acc;
        }, {});

        setStudentsStatuses(studentsStatuses);

        console.log('students:::', studentsStatuses);
      }
      setError(false);
    } catch (e) {
      setError(true);
    }
  };

  useEffect(() => {
    fetcher(classId);
  }, [classId]);

  if (error) {
    return (<div> Class is not active </div>);
  }

  const markAttendance = (checkStatus: boolean, studentAttendanceStatus: StudentAttendance): void => {
    if (studentsStatuses) {
      const _studentsStatuses = { ...studentsStatuses };
      const studentStatuses = [...studentsStatuses[studentAttendanceStatus.studentId]];

      if (studentStatuses) {
        const foundStatus = studentStatuses.find(st => st.attendanceDate === studentAttendanceStatus.attendanceDate);
        const foundStatusIndex = studentStatuses.findIndex(st => st.attendanceDate === studentAttendanceStatus.attendanceDate);

        if (foundStatus) {
          const newStatus = { ...foundStatus, status: checkStatus ? AttendanceStatus.PRESENT : AttendanceStatus.ABSENT };

          studentStatuses[foundStatusIndex] = newStatus;
          _studentsStatuses[studentAttendanceStatus.studentId] = studentStatuses;
          setStudentsStatuses(_studentsStatuses);
        }
      }
    }
  };

  const attendanceOptions = (studentAttendanceStatus: StudentAttendance): JSX.Element => {
    const atStatus = studentAttendanceStatus.status === AttendanceStatus.PRESENT;

    return (
      <Form.Check
        type="checkbox"
        label={!atStatus ? 'Absent' : 'Present'}
        checked={atStatus}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void => markAttendance(e.target.checked, studentAttendanceStatus)}
      />
    );
  };

  const completeAttendance = async (): Promise<void> => {
    if (classroomAttendance && classroomAttendance.students && studentsStatuses) {
      const allAttendance = classroomAttendance.students.reduce<StudentAttendance[]>((rec, st) => rec.concat(studentsStatuses[st.id]), []);

      await markClassAttendance(classId, allAttendance);
    }
  };

  return (
    <div className="shadow-box">
      <h4>STUDENTS</h4>
      <div className="attendance-grid">
        <div className="students">
          <div>STUDENTS</div>

          {classroomAttendance?.students?.map(student => (<div key={student.id}>{student.firstName}</div>))}
        </div>

        <Table striped bordered hover responsive>
          <thead>
            <tr>
              {allTimeTableDays && allTimeTableDays.map(dt => (<th key={dt.toISOString()}>{format(dt, 'd MMM yy')}</th>))}
            </tr>
          </thead>
          <tbody>
            {classroomAttendance?.students?.map(st => (
              <tr key={st.id}>
                {studentsStatuses && studentsStatuses[st.id]?.map(classTime => (<td key={classTime.attendanceDate.toISOString()}>{attendanceOptions(classTime)}</td>))}
              </tr>
            ))}
          </tbody>
        </Table>

      </div>
      <button onClick={completeAttendance}>Mark</button>
    </div>
  );
}

export default AttendanceList;
