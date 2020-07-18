import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

type DeleteModalProps<T> = {
  entity: T;
  show: boolean;
  title: string;
  message: (entity: T) => JSX.Element;
  confirmValue?: (entity: T) => string;
  onConfirm: () => Promise<void>;
  onClose: () => void;
}

function DeleteModal<T>(props: DeleteModalProps<T>): JSX.Element {
  const { show, title, message, onConfirm, onClose, confirmValue, entity } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [canDelete, setCanDelete] = useState(true);
  const [confirmInput, setConfirmInput] = useState<string>();

  useEffect(() => {
    if (!confirmValue) {
      return;
    }

    setCanDelete(confirmInput === confirmValue(entity));
  }, [confirmInput, confirmValue, entity]);

  const _onConfirm = useCallback(async () => {
    setIsSubmitting(true);
    await onConfirm();
    setIsSubmitting(false);
  }, [setIsSubmitting, onConfirm]);

  let confirmBox = null;
  if (confirmValue) {
    confirmBox = (
      <React.Fragment>
        <br /><br />
        Please type <strong>{confirmValue(entity)}</strong> to confirm:
        <Form.Group>
          <Form.Control
            type="text"
            placeholder={`Type ${confirmValue(entity)} here...`}
            onChange={(e: React.ChangeEvent<HTMLInputElement>): void => setConfirmInput(e.target.value)}
          />
        </Form.Group>
      </React.Fragment>
    );
  }

  return (
    <Modal show={!!show} onHide={onClose}>
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {message(entity)}
        {confirmBox}
      </Modal.Body>
      <Modal.Footer>
        <React.Fragment>
          <Button variant="primary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={_onConfirm} disabled={isSubmitting || !canDelete}>
            Delete
          </Button>
        </React.Fragment>
      </Modal.Footer>
    </Modal>
  );
}

type DeleteModalPrefilledProps<T> = Omit<DeleteModalProps<T>, 'show' | 'title' | 'onClose' | 'onConfirm' | 'modalSubmitted' | 'entity' | 'message'> &
  Partial<Pick<DeleteModalProps<T>, 'message'>>;

type OnDeleteFunc<T> = ((entity: T) => void) | ((entity: T) => Promise<void>);
type NameFunc<T> = (entity: T) => string;

type UseDeleteModal<T> = [
  (props: DeleteModalPrefilledProps<T>) => JSX.Element | null,
  (entity: T) => void,
]

export function useDeleteModal<T>(onDelete: OnDeleteFunc<T>, title: string, getEntityName: NameFunc<T>): UseDeleteModal<T> {
  const [entity, setEntity] = useState<T | null>(null);

  const _onConfirm = useCallback(async (): Promise<void> => {
    if (!entity) {
      throw new Error('Entity required');
    }

    await onDelete(entity);

    setEntity(null);
  }, [entity, onDelete]);

  const _onClose = useCallback((): void => {
    setEntity(null);
  }, []);

  const ModalComponent = useCallback((props: DeleteModalPrefilledProps<T>): JSX.Element | null => {
    if (!entity) {
      return null;
    }

    return (
      <DeleteModal
        entity={entity}
        show={!!entity}
        title={title}
        message={(): JSX.Element => (
          <React.Fragment>
            Do you really want to delete <strong>{getEntityName(entity)}</strong>?
          </React.Fragment>
        )}
        onClose={_onClose}
        onConfirm={_onConfirm}
        {...props}
      />
    );
  }, [_onClose, _onConfirm, entity, getEntityName, title]);

  return [ModalComponent, setEntity];
}
