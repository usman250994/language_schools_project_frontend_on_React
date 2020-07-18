import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Button, Form, FormControl, InputGroup, Navbar } from 'react-bootstrap';
import { useHistory } from 'react-router';

import useOnClickOutside from '../../../hooks/on-click-outside';
import { UserRole } from '../../../services/role-management/roles';
import { SessionContext } from '../../contexts/session';

import './header.scss';

function Header(): JSX.Element {
  const [state, dispatchSession] = useContext(SessionContext);
  const { user, profile } = state;
  if (!user || !profile) {
    throw new Error('User expected');
  }

  const menuRef = React.useRef<HTMLHeadingElement>(null);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const history = useHistory();

  useOnClickOutside(menuRef, () => setShowDropdown(false));

  const settings = (): void => {
    history.push('/settings');
    setShowDropdown(false);
  };

  const logout = (): void => {
    dispatchSession({ type: 'LOGOUT' });
    setShowDropdown(false);

    history.push('/');
  };

  const userName = `${profile.firstName} ${profile.lastName}`;

  const role = '';

  return (
    <Navbar expand="lg">
      <Form inline>
        <InputGroup className="border">
          <FormControl aria-label="Default" aria-describedby="inputGroup-sizing-default" placeholder="Search usernames" />
          <InputGroup.Prepend>
            <Button>Search</Button>
          </InputGroup.Prepend>
        </InputGroup>
      </Form>
      <Navbar.Collapse className="justify-content-end">
        <div className="dropdown" ref={menuRef}>
          <div className="dropdown-btn" onClick={(): void => setShowDropdown(!showDropdown)}>
            <div className="user-name">{userName}</div>
            {user.role === UserRole.ADMIN && <div className="company">{role}</div>}
          </div>
          {showDropdown && (
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={settings}>
                <FontAwesomeIcon icon={FAS.faCogs} />
                <span>Settings</span>
              </button>
              <button className="dropdown-item" onClick={logout}>
                <FontAwesomeIcon icon={FAS.faSignOutAlt} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Header;
