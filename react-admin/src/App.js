import React from 'react';
import { Admin, Resource } from 'react-admin';
import users from "./users";
import products from "./products";
import kiosks from "./kiosks";
import Dashboard from './dashboard/Dashboard';

import LoginWithTheme from "./elements/login";
import { authProvider } from "./providers/auth";
import { client } from "./providers/client";
import { dataProvider } from "./providers";
import { realTimeProvider } from "./providers/realtime";

const App = () => (
  <Admin dashboard={Dashboard}
    authProvider={authProvider(client)}
    dataProvider={dataProvider}
    customSagas={[realTimeProvider]}
    loginPage={LoginWithTheme}
  >
    <Resource {...users} />
    <Resource {...products} />
    <Resource {...kiosks} />
  </Admin>

);

export default App;