import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import App2 from "./App2.jsx";
import './index.css'
import './config/firebase-config'
import { Provider as ReduxProvider } from 'react-redux';
import {store} from "./store/Store.jsx";
import { CookiesProvider } from "react-cookie";
import SocketClient from "./service/Socket/SocketClient.jsx";

export const socketClient = new SocketClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CookiesProvider>
      <ReduxProvider store={store}>
          {/*<App />*/}
          <App2/>
      </ReduxProvider>
    </CookiesProvider>
  </React.StrictMode>,
)
