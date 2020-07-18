import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import * as FAS from '@fortawesome/free-solid-svg-icons';

import WIP from '../../shared/components/WIP';
import { Session } from '../../shared/contexts/session';

import { UserRole, ClientRole } from './roles';

export type Route = {
  component: (props?: any) => JSX.Element;
  name: string;
  url: string;
  sidebar: boolean;
  icon?: IconDefinition;
  userRoles: UserRole[];
  clientRoles?: ClientRole[];
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

export function getRoutes({ user, client }: Session): Route[] {
  if (!user) {
    return [];
  }

  let filteredRoutes = routes.filter((route) => route.userRoles.includes(user.role));

  if (client && user.role === UserRole.CLIENT) {
    filteredRoutes = filteredRoutes.filter((route) => route.clientRoles && client.role && route.clientRoles.includes(client.role));
  }

  return filteredRoutes;
}
