import * as fonts from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { UserRole } from '../../../services/role-management/roles';
import { getRoutes, Route } from '../../../services/role-management/routes';
import { SessionContext } from '../../contexts/session';
import { Logo } from '../Logo';

import './sidebar.scss';

interface NavSectionProps {
  title: string;
  routes: Route[];
}

function NavSection(props: NavSectionProps): JSX.Element {
  const { title, routes } = props;

  return (
    <React.Fragment>
      <Nav.Item className="role-head">{title}</Nav.Item>
      {routes.map((route, key) => {
        const url = route.url;

        return (
          <Nav.Link as={NavLink} to={url} key={key}>
            <FontAwesomeIcon icon={route.icon ? route.icon : fonts.faCircle} size="sm" className="icon" />
            {route.name}
          </Nav.Link>
        );
      })}
    </React.Fragment>
  );
}

function Sidebar(): JSX.Element {
  const [{ user }] = useContext(SessionContext);
  if (!user) {
    throw new Error('User expected');
  }

  const routes = getRoutes({ user }).filter(route => route.sidebar);
  const adminRoutes = routes.filter(route => route.userRoles.length === 1 && route.userRoles.includes(UserRole.ADMIN));

  let adminNav = null;
  if (user.role === UserRole.ADMIN) {
    adminNav = <NavSection title="Administrator" routes={adminRoutes} />;
  }

  return (
    <nav className="col-sm-2 d-sm-block sidebar">
      <div className="company-logo"><Logo style={{ fill: 'white' }} /></div>
      <div className="sidebar-sticky" />
      <Nav className="nav flex-column">
        {adminNav}
      </Nav>
    </nav>
  );
}

export default Sidebar;
