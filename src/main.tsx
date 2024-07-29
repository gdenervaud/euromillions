import React from 'react'
import ReactDOM from 'react-dom/client'
import {JssProvider} from 'react-jss';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import App from './components/App';

import './helpers/IconsImport';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JssProvider id={{minify: true}}>
      <App />
    </JssProvider>
  </React.StrictMode>
);
