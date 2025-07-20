import React from 'react'
import ReactDOM from 'react-dom/client'
import {JssProvider} from 'react-jss';
import 'bootstrap/dist/css/bootstrap.min.css';

import './index.css';
import App from './components/App';

import './helpers/IconsImport';
import { ClerkProvider, useAuth } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';
import { ConvexReactClient } from 'convex/react';

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JssProvider id={{minify: true}}>
      <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          <App />
        </ConvexProviderWithClerk>
      </ClerkProvider>
    </JssProvider>
  </React.StrictMode>
);
