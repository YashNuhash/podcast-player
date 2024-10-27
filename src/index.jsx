import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
// import { createRoot } from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import { store, persistor } from './store/store'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './index.scss'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate persistor={persistor}>
          <Auth0Provider
            domain="nexcast.us.auth0.com"
            clientId="vr3nKFFoEa7vOBR3dXzAXSuZgiVCHV90"
            authorizationParams={{
              redirect_uri: window.location.origin
          }}>
           <App />
        </Auth0Provider>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
