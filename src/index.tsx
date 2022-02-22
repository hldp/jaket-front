import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import store from "./store/store"

function saveToLocalStorage(state: any) {
  try {
    const serialisedState = JSON.stringify(state);
    localStorage.setItem("persistantState", serialisedState);
  } catch (e) {
    console.warn(e);
  }
}

store.subscribe(() => saveToLocalStorage(store.getState()));

ReactDOM.render(
    <React.StrictMode>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="crossOrigin=""/>
      <link href="https://fonts.googleapis.com/css2?family=Material+Icons" rel="stylesheet"></link>
      <Provider store={store}>
        <App></App>
      </Provider>
    </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
