import React from 'react';

import SessionContextProvider from '../shared/contexts/session';
import ToastContextProvider from '../shared/contexts/toast';

import AppRoute from './App.Route';

function App(): JSX.Element {
  return (
    <SessionContextProvider>
      <ToastContextProvider>
        <AppRoute />
      </ToastContextProvider>
    </SessionContextProvider>
  );
}

export default App;
