import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button } from 'react-bootstrap';

import './ActionButtons.scss';

type ButtonProps = {
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  disabled?: boolean;
  text?: string;
  onClick?: () => void;
  variant?: | 'primary'| 'secondary'| 'success'| 'danger'| 'warning'| 'info'| 'dark'| 'light'| 'link'| 'outline-primary'| 'outline-secondary'| 'outline-success'| 'outline-danger'| 'outline-warning'| 'outline-info'| 'outline-dark'| 'outline-light';
}

export function AddButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" {...props}>
      <FontAwesomeIcon icon={FAS.faPlus} />
      {props.text && <span>{props.text}</span>}
    </Button>
  );
}

export function CancelButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" variant="danger" {...props}>
      <FontAwesomeIcon icon={FAS.faTimes} />
    </Button>
  );
}

export function DeleteButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" variant="danger" {...props}>
      <FontAwesomeIcon icon={FAS.faTrash} />
      {props.text && <span>{props.text}</span>}
    </Button>
  );
}

export function EditButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" {...props}>
      <FontAwesomeIcon icon={FAS.faPencilAlt} />
    </Button>
  );
}

export function SaveButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" {...props}>
     {props.title} <FontAwesomeIcon icon={FAS.faCheck} />
    </Button>
  );
}

export function LinkButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" {...props}>
      <FontAwesomeIcon icon={FAS.faExternalLinkAlt} />
    </Button>
  );
}

export function EmailButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" {...props}>
      <FontAwesomeIcon icon={FAS.faEnvelopeOpen} />
    </Button>
  );
}

export function InfoButton(props: ButtonProps): JSX.Element {
  return (
    <Button className="button-icon" variant="dark" {...props}>
      <FontAwesomeIcon icon={FAS.faInfo} />
      {props.text && <span>{props.text}</span>}
    </Button>
  );
}
