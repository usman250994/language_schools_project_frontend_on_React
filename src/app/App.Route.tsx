import React, { useContext } from 'react';
import { Redirect, Router, Switch, Route } from 'react-router-dom';

import history from '../helpers/history';
import LandingContainer from '../modules/landing/landing.container';
import LoginForm from '../modules/login-form/login-form';
import { Route as CustomRoute, getRoutes } from '../services/role-management/routes';
import { PageNotFound } from '../shared/components/PageNotFound/PageNotFound';
import { SessionContext } from '../shared/contexts/session';

import PrivateSection from './PrivateSection';
import PublicSection from './PublicSection';

export default function AppRoute(): JSX.Element {
  const [state] = useContext(SessionContext);
  const routes: CustomRoute[] = getRoutes(state);

  return (
    <Router history={history}>
      <PublicSection>
        <Switch>
          <Redirect path="/" exact to="/login" />
          <Route path="/login" render={(): JSX.Element => <LoginForm />} />
          <Redirect path="*" exact to="/login" />
        </Switch>
      </PublicSection>
      <PrivateSection>
        <Switch>
          <Redirect path="/" exact to="/landing" />
          <Route path="/landing" render={(): JSX.Element => <LandingContainer />} />
          {routes.map((route, key) => (
            <Route path={route.url} key={key} exact render={(): JSX.Element => <route.component />} />
          ))}
          <Route path="*" render={(): React.ReactNode => <PageNotFound />} />
        </Switch>
      </PrivateSection>
    </Router>
  );
}
