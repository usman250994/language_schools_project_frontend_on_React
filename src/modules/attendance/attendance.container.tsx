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
  const [divisionSelected, setDivisionSelected] = useState<string>();
  const _setClassSelected = (_classroomId?: string): void => {
    if (_classroomId) {
      setClassSelected(_classroomId);
    }
  };
  const _onDivisionSelect = (_divisionId?: string): void => {
    if (_divisionId) {
      setDivisionSelected(_divisionId);
    }
  };

  return (
    <div>
      <div className="shadow-box">
        <SelectClass onClassSelect={_setClassSelected} onDivisionSelect={_onDivisionSelect} />
        {classSelected && <AttendanceList classId={classSelected} divisionId={divisionSelected} />}
      </div>
    </div>
  );
}

export default AttendanceContainer;
