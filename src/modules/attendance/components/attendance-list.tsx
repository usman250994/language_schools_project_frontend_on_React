import { Formik, Form as FormikForm } from 'formik';
import React, { useState, useContext } from 'react';
import { CellProps } from 'react-table';
import { UserAttendance } from '../../../services/api-services/user';
import { ToastContext } from '../../../shared/contexts/toast';
import ReactTable from '../../../shared/components/tables/table';
import { EditButton, SaveButton } from '../../../shared/components/ActionButtons';
import { InputField } from '../../../shared/components/formik/InputField';
import { Checkbox } from '../../../shared/components/formik/Checkbox';
import { boolean } from 'yup';

interface AttendanceListProps {
	students: UserAttendance[];
	handleAttendance: (students: UserAttendance[]) => Promise<any>;
}

function AttendanceList(props: AttendanceListProps): JSX.Element {
	let { students, handleAttendance } = props;

	const [isSubmitting, setIsSubmitting] = useState(false);
	const setToast = useContext(ToastContext);

	const fullNameCell = (data: CellProps<UserAttendance>): string => {
		const user = data.row.original;
		return `${user.fullName}`;
	};
	const statusCell = (data: CellProps<UserAttendance>): boolean | JSX.Element => {
		const user = data.row.original;
console.log('yaha aya?')
		return (
			<Checkbox
				onClick={() => updateStatus(user)}
				name={user.id}
				value={mine}
			/>
		);
	};

	const mine = () => { }

	const updateStatus = (user: any): void => {

		students = students.map((x) => (x.id === user.id ?
			{ status: !x.status, fullName: x.fullName, id: x.id }
			: x
		));
		students = [...students];
	
	}

	const onSubmit = async (): Promise<void> => {

		setIsSubmitting(true);
		try {
			const updated = await handleAttendance(students);
			// setInitialValues(students);
			   students = [...students];
			setToast({ type: 'success', message: 'Class attendance succesfully updated' });
		} catch (err) {
			setToast({ type: 'error', message: err.message });
		} finally {
			// setIsSubmitting(false);
		}
	};

	const columns = [{
		Header: 'Full Name',
		Cell: fullNameCell,
	}, {
		Header: 'Present',
		Cell: statusCell,
	}];

	return (
		<div className="shadow-box">
			<h4>STUDENTS</h4>

			<Formik
				enableReinitialize={false}
				initialValues={students}
				onSubmit={onSubmit}
			>
				<FormikForm>
					<ReactTable
						data={students}
						columns={columns}
						total={students.length}
					/>
					<SaveButton type="submit" />
				</FormikForm>
			</Formik>

		</div>
	);
}

export default AttendanceList;
