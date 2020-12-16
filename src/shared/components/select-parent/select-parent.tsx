import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';

import { listusersByInputWord, User } from '../../../services/api-services/user';
import { UserRole } from '../../../services/role-management/roles';

import './select-parent.scss';

type SelectClassProps = {
    onParentSelect?: (parentId: string | undefined) => void;
    heading?: string;
    defaultParent?: User;
}

export function SelectParent(props: SelectClassProps): JSX.Element {
  const { onParentSelect, heading, defaultParent } = props;

  const [selectedParentId, setSelectedParentId] = useState<string>();

  const loadParents = async (inputValue: string): Promise<{ id: string; firstName: string; lastName: string }[]> => {
    const { data } = await listusersByInputWord(UserRole.PARENT, 0, 5, inputValue);

    return data.map((d: User) => ({ id: d.id, firstName: d.firstName, lastName: d.lastName }));
  };

  return (
    <React.Fragment>
      <h5>{heading ?? 'Select Parent'}</h5>
      <Row className="select-parent">
        <Col>
          <AsyncSelect
            placeholder="Select Parent"
            loadOptions={loadParents}
            defaultOptions
            onChange={(value: any): void => {
              onParentSelect && onParentSelect(value.id);
            }}
            onMenuOpen={() => {
              setSelectedParentId('s');
            }}
            defaultValue={defaultParent}
            getOptionLabel={(option: User): string => `${option.firstName} ${option.lastName}`}
            getOptionValue={(option: User): string => option.id}
          />

        </Col>
      </Row>
    </React.Fragment>
  );
}
