import * as fonts from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

import { UserRole } from '../../../services/role-management/roles';
import { getRoutes, Route } from '../../../services/role-management/routes';
import { SessionContext } from '../../contexts/session';

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
  // are following lines needed? are we not already filtering in `getroutes` function above
  const adminRoutes = routes.filter(route => route.userRoles.includes(UserRole.ADMIN));
  const superAdminRoutes = routes.filter(route => route.userRoles.includes(UserRole.SUPER_ADMIN));
  const teacherRoutes = routes.filter(route => route.userRoles.includes(UserRole.TEACHER));
  const parentRoutes = routes.filter(route => route.userRoles.includes(UserRole.PARENT));
  const studentRoutes = routes.filter(route => route.userRoles.includes(UserRole.STUDENT));

  let adminNav = null;
  let superAdminNav = null;
  let teacherNav = null;
  let parentNav = null;
  let studentNav = null;

  if (user.role === UserRole.ADMIN) {
    adminNav = <NavSection title="Admin Manages" routes={adminRoutes} />;
  }
  if (user.role === UserRole.SUPER_ADMIN) {
    superAdminNav = <NavSection title="Super Admin Manages" routes={superAdminRoutes} />;
  }
  if (user.role === UserRole.TEACHER) {
    teacherNav = <NavSection title="Teacher Manages" routes={teacherRoutes} />;
  }
  if (user.role === UserRole.PARENT) {
    parentNav = <NavSection title="Parent Manages" routes={parentRoutes} />;
  }
  if (user.role === UserRole.STUDENT) {
    studentNav = <NavSection title="Student Manages" routes={studentRoutes} />;
  }

  return (
    <nav className="col-sm-2 d-sm-block sidebar">
      <div className="company-logo">SprachCenter</div>
      <div className="sidebar-sticky" />
      <Nav className="nav flex-column">
        {adminNav}
        {superAdminNav}
        {teacherNav}
        {parentNav}
        {studentNav}
      </Nav>
    </nav>
  );
}

export default Sidebar;
