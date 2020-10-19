import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import AsyncSelect from 'react-select/async';
import { UserRole } from '../../../services/role-management/roles';

import { listusersByInputWord } from '../../../services/api-services/user';

type SelectClassProps = {
    onParentSelect?: (parentId: string | undefined) => void;
}

export function SelectParent(props: SelectClassProps): JSX.Element {
    const { onParentSelect } = props;

    const [selectedParentId, setSelectedParentId] = useState<string>();

    const loadParents = async (inputValue: string): Promise<{ value: string; label: string }[]> => {
        const { data } = await listusersByInputWord(UserRole.PARENT, 0, 5, inputValue);
        return data.map((d: any) => ({ value: d.id, label: d.name }));
    };

    return (
        <React.Fragment>
            <h5>Select Parent</h5>
            <Row>
                <Col>
                    <AsyncSelect
                        placeholder="Select Parent"
                        loadOptions={loadParents}
                        defaultOptions
                        onChange={(value: any): void => {
                            onParentSelect && onParentSelect(value.value);
                        }}
                        onMenuOpen={() => {
                            setSelectedParentId('s');
                        }}
                    />

                </Col>
            </Row>
        </React.Fragment>
    );
}
