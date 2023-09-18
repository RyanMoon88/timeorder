import React from 'react';
import ReactDOM from 'react-dom';
import Router from 'Router';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { CookiesProvider } from 'react-cookie';
import { GlobalStateProvider } from './state';
import * as serviceWorker from './serviceWorker';
// import reducer from './reducer';
import './style/common.css'

// const store = createStore(reducer);

ReactDOM.render(
    <GlobalStateProvider>
        <CookiesProvider>
            {/* <Provider store = {store} > */}
                <Router/>
            {/* </Provider> */}
        </CookiesProvider>
    </GlobalStateProvider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
