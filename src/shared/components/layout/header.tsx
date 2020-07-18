import * as FAS from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Button, Form, FormControl, InputGroup, Navbar } from 'react-bootstrap';
import { useHistory } from 'react-router';

import useOnClickOutside from '../../../hooks/on-click-outside';
import { UserRole, UserRoleText, ClientRoleText } from '../../../services/role-management/roles';
import { SessionContext } from '../../contexts/session';

import './header.scss';

function Header(): JSX.Element {
  const [state, dispatchSession] = useContext(SessionContext);
  const { user, profile, client } = state;
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

  const switchClient = (): void => {
    history.push('/clients');
    setShowDropdown(false);
  };

  const logout = (): void => {
    dispatchSession({ type: 'LOGOUT' });
    setShowDropdown(false);

    history.push('/');
  };

  const userName = `${profile.firstName} ${profile.lastName}`;

  let clientName = '';
  if (user.role === UserRole.CLIENT && client && client.role) {
    clientName = client.name;
  }

  let role = '';
  if (user.role === UserRole.ADMIN) {
    role = UserRoleText[user.role];
  } else if (user.role === UserRole.CLIENT && client && client.role) {
    role = ClientRoleText[client.role];
  }

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
            {user.role === UserRole.CLIENT && <div className="company">{clientName} - {role}</div>}
          </div>
          {showDropdown && (
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
              <button className="dropdown-item" onClick={settings}>
                <FontAwesomeIcon icon={FAS.faCogs} />
                <span>Settings</span>
              </button>
              { user.role === UserRole.CLIENT && <button className="dropdown-item" onClick={switchClient}>
                <FontAwesomeIcon icon={FAS.faUsers} />
                <span>Switch User Group</span>
              </button>
              }
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
