import React, { useState } from 'react';

import useOnClickOutside from '../../hooks/on-click-outside';

import './DropdownMenu.scss';

export type MenuItem = {
  onClick: (event: React.MouseEvent) => void;
  text: JSX.Element | string;
}

type DropdownMenuProps = {
  dropdownButtonValue: JSX.Element | string;
  dropdownMenuItems: MenuItem[];
}

const DropdownMenu = (props: DropdownMenuProps): JSX.Element => {
  const { dropdownButtonValue, dropdownMenuItems } = props;

  const [showMenu, setShowMenu] = useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setShowMenu(false));

  return (
    <div className="dropdown" ref={menuRef}>
      <div className="dropdown-btn" onClick={(): void => setShowMenu(!showMenu)}>
        {dropdownButtonValue}
      </div>
      {showMenu && (
        <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
          {dropdownMenuItems.map((menuItem, key) => (
            <button key={key} className="dropdown-item" onClick={menuItem.onClick}>
              {menuItem.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
