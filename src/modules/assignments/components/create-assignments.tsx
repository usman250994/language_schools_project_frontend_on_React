import React, { useContext, useState } from 'react';
import { Button } from 'react-bootstrap';
import {useDropzone} from 'react-dropzone';

import { uploadAssignmentToClassroom } from '../../../services/api-services/assignment';
import AppSpinner from '../../../shared/components/layout/spinner';
import { SelectClass } from '../../../shared/components/select-class.tsx/select-class';
import { ToastContext } from '../../../shared/contexts/toast';

import './dropzone.scss';

interface CreateAssignmentsProps {
  classSelected: string | undefined;
  setClassSelected: (s: string | undefined) => void;
  onUpdate?: () => void;
}

export function CreateAssignments(props: CreateAssignmentsProps): JSX.Element {
  const { classSelected, setClassSelected, onUpdate } = props;

  const setToast = useContext(ToastContext);

  const [loading, setLoading] = useState(false);

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone();
  const files = acceptedFiles.map(file => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const addAssignment = async (): Promise<void> => {
    if (!classSelected) return;

    try {
      setLoading(true);
      await uploadAssignmentToClassroom({
        classId: classSelected,
        files:acceptedFiles,
      });

      if (onUpdate) {
        onUpdate();
      }

      setToast({ type: 'success', message: 'Upload successful' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="shadow-box">
      <h4>Upload New Assignment</h4>
      <section>
        <div {...getRootProps({className: 'dropzone'})}>
          <input {...getInputProps()} />
          <p>Drag &apos;n&apos; drop some files here, or click to select files</p>
        </div>
        <aside>
          <ul>{files}</ul>
        </aside>
      </section>
      <div className="text-right">
        <Button disabled={files.length === 0 || !classSelected || loading} onClick={addAssignment}>
          {loading ? <AppSpinner /> : 'Add Assignments'}
        </Button>
      </div>
    </div>
  );
}
