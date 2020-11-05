import React from "react";
import Switch from "react-switch";


type ToggleClassProps = {
    checked: boolean;
    handleChange: () => void;
    uncheckedIcon: boolean;

}
export function ToggleSwitch(props: ToggleClassProps): JSX.Element {
    const { checked, handleChange, uncheckedIcon } = props;

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <label>Create Attendance</label><Switch onChange={handleChange} checked={checked} uncheckedIcon={uncheckedIcon}
            /><label>Update/View Attendance</label>
        </div>
    );

}