import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';

import WIP from '../../shared/components/WIP';
import { Session } from '../../shared/contexts/session';

import { UserRole } from './roles';

export type Route = {
  component: (props?: any) => JSX.Element;
  name: string;
  url: string;
  sidebar: boolean;
  icon?: IconDefinition;
  userRoles: UserRole[];
}

const routes: Route[] = [{
  // Super Admin only
  component: WIP,
  name: 'Dashboard',
  url: '/dashboard',
  sidebar: true,
  icon: FAS.faTachometerAlt,
  userRoles: [UserRole.ADMIN],
}];

export function getRoutes({ user }: Session): Route[] {
  if (!user) {
    return [];
  }

  const filteredRoutes = routes.filter((route) => route.userRoles.includes(user.role));

  return filteredRoutes;
}
