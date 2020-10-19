import React, { useCallback, useContext } from 'react';
import { CellProps } from 'react-table';

import { ASSIGNMENT_MEDIA } from '../../../config/constants';
import { useDeleteModal } from '../../../hooks/delete-modal';
import { listAssignments, Assignment } from '../../../services/api-services/assignment';
import { deleteSchool } from '../../../services/api-services/school';
import { DeleteButton } from '../../../shared/components/ActionButtons';
import { PaginatedTable } from '../../../shared/components/tables/paginated-table';
import { ToastContext } from '../../../shared/contexts/toast';

interface ListAssignmentsProps {
  classSelected: string;
  onUpdate?: () => void;
  refresh: boolean;
}

function ListAssignments(props: ListAssignmentsProps): JSX.Element {
  const { classSelected, onUpdate, refresh } = props;

  const setToast = useContext(ToastContext);

  const fn = useCallback((offset: number, limit: number) => listAssignments(classSelected, offset, limit), [classSelected, refresh]);

  const nameCell = (data: CellProps<Assignment>): string | JSX.Element => {
    const assignment = data.row.original;

    return <a href={`${ASSIGNMENT_MEDIA}/${assignment.key}`} rel="noopener noreferrer" target= "_blank">{assignment.key}</a>;
  };

  const onDelete = useCallback(async (assignment: Assignment): Promise<void> => {
    try {
      await deleteSchool(assignment.id);

      setToast({ type: 'success', message: 'Assignment deleted Successfully' });

      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  }, [setToast]);

  const nameFn = useCallback((assignment: Assignment): string => assignment.key, []);
  const [DeleteModal, showDeleteModal] = useDeleteModal(onDelete, 'Delete Assignment', nameFn);

  const actionCell = (data: CellProps<Assignment>): JSX.Element | string => {
    const assignment = data.row.original;

    return (
      <React.Fragment>
        {/* <DeleteButton onClick={(): void => showDeleteModal(assignment)} title="Delete Assignment" /> */}
      </React.Fragment>
    );
  };

  const columns = [{
    Header: 'Link',
    Cell: nameCell,
  }, {
    Header: ' ',
    Cell: actionCell,
  }];

  return (
    <div className="shadow-box">
      <h4>Assignments</h4>

      <PaginatedTable
        fn={fn}
        pageSize={10}
        columns={columns}
      />

      <DeleteModal
        message={(assignment: Assignment): JSX.Element => (
          <React.Fragment>
            This action cannot be undone. This will permanently delete the <strong>{assignment.key}</strong>.
          </React.Fragment>
        )}
        confirmValue={(assignment: Assignment): string => assignment.key}
      />
    </div>
  );
}

export default ListAssignments;
