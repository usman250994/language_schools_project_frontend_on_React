import React, { useCallback, useState, useContext } from 'react';
import { Row, Col } from 'react-bootstrap';
import { UserAttendance, createUserAttendance, updateUserAttendance } from '../../services/api-services/attendance';
import { listUsersOfClass } from '../../services/api-services/user';
import { UserRole } from '../../services/role-management/roles';
import { SelectClass } from '../../shared/components/select-class.tsx/select-class';
import { ToggleSwitch } from '../../shared/components/toggle';
import { ToastContext } from '../../shared/contexts/toast';
import AttendanceList from './components/attendance-list';

function AttendanceContainer(): JSX.Element {

    const [classSelected, setClassSelected] = useState<string>();
    const [classDate, setClassDate] = useState<number>();
    const [toggleView, setToggleView] = useState<boolean>(true);
    const setToast = useContext(ToastContext);
    const [classRoomStudents, setClassRoomStudents] = useState<any[]>([]);
    const _setClassSelected = async (_classroomId?: string) => {
        if (_classroomId) {
            setClassSelected(_classroomId);
            const a = await listUsersOfClass(UserRole.STUDENT, _classroomId, 0, 20);
            const students = a.data.map(x => ({ status: false, id: x.id, fullName: x.firstName + x.lastName }))
            students.push({ id: 'ss', fullName: 'ss', status: false })
            setClassRoomStudents(students);
        }
    };

    const handleAttendance = async (students: UserAttendance[]) => {
        try {
            const stud = students.map(x => ({ id: x.id, status: x.status }));
            if (toggleView) {
                 await createUserAttendance(stud, classSelected)
            } else {
                await updateUserAttendance(stud, classSelected, classDate)
            }
            return true;
        } catch (e) {
            setToast({ type: 'error', message: e.message });
            return false;
        }

    }
    const changeView = () => {
        setToggleView(!toggleView)
    }
    const dateSelected = (e: any) => {
        setClassDate(new Date(e.target.value).getTime())
    }
    return (
        <div>
            <h4 style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}>Manage Attendance</h4>
            <ToggleSwitch checked={toggleView} handleChange={changeView} uncheckedIcon={false} />
            <Row>
                <Col>
                    <div className="shadow-box">
                        <SelectClass onClassSelect={_setClassSelected} />
                    </div>
                    {!toggleView ? <div className="shadow-box">
                        <label> Pick Attendance Date to View:</label> <input type="date" name="classDate" onChange={dateSelected} />
                    </div> : null}
                </Col>
            </Row>
            {classRoomStudents.length ? <Row>
                <Col>
                    <div className="shadow-box">

                        <AttendanceList
                            students={classRoomStudents}
                            handleAttendance={handleAttendance}
                        />

                    </div>
                </Col>
            </Row> : null}
        </div>
    );
}

export default AttendanceContainer;
