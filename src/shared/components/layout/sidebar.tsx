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
  const [{ client }, dispatchSession] = useContext(SessionContext);

  return (
    <React.Fragment>
      <Nav.Item className="role-head">{title}</Nav.Item>
      {routes.map((route, key) => {
        let url = route.url;
        const hasClientIDInPath = url.includes('/:clientId');

        if (hasClientIDInPath) {
          const clientId = client ? client.id : 'unknown';

          url = url.replace('/:clientId', `/${clientId}`);
        }

        const onClick = (): void => {
          if (!hasClientIDInPath) {
            dispatchSession({
              type: 'SET_CLIENT',
              client: undefined,
            });
          }
        };

        return (
          <Nav.Link as={NavLink} to={url} key={key} onClick={onClick}>
            <FontAwesomeIcon icon={route.icon ? route.icon : fonts.faCircle} size="sm" className="icon" />
            {route.name}
          </Nav.Link>
        );
      })}
    </React.Fragment>
  );
}

function Sidebar(): JSX.Element {
  const [{ user, client }] = useContext(SessionContext);
  if (!user) {
    throw new Error('User expected');
  }

  const routes = getRoutes({ user, client }).filter(route => route.sidebar);
  const adminRoutes = routes.filter(route => route.userRoles.length === 1 && route.userRoles.includes(UserRole.ADMIN));
  const clientRoutes = routes.filter(route => route.userRoles.includes(UserRole.CLIENT));

  let adminNav = null;
  if (user.role === UserRole.ADMIN) {
    adminNav = <NavSection title="Administrator" routes={adminRoutes} />;
  }

  let clientNav = null;
  if (client) {
    clientNav = (
      <NavSection title={client.name} routes={clientRoutes.filter(route => {
        if (user.role === UserRole.ADMIN && route.userRoles.includes(UserRole.ADMIN)) {
          return true;
        }

        if (!client.role) {
          return false;
        }

        return route.clientRoles?.includes(client.role);
      })}
      />
    );
  }

  return (
    <nav className="col-sm-2 d-sm-block sidebar">
      <div className="company-logo"><Logo style={{ fill: 'white' }} /></div>
      <div className="sidebar-sticky" />
      <Nav className="nav flex-column">
        {adminNav}
        {clientNav}
      </Nav>
    </nav>
  );
}

export default Sidebar;
