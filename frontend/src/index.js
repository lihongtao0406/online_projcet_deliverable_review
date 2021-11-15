import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Helmet} from 'react-helmet';

ReactDOM.render(
  <React.StrictMode>
    <Helmet>
    <meta
      name="viewport"
      content="minimum-scale=1, initial-scale=1, width=device-width"
    /> 
    </Helmet>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
