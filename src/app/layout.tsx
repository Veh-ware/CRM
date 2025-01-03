'use client'; // Mark as a client component

import * as React from 'react';
import '../styles/global.css';

import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

import { UserProvider } from '@/contexts/user-context';
import { LocalizationProvider } from '@/components/core/localization-provider';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';
import { AppProvider } from '@/contexts/isLogin';

// Load the Stripe publishable key
const stripePromise = loadStripe('pk_test_51Q5CQjBSRlxFwzyWZZr67eMkwml3WUCZdRg4bcW5mtBx1NffoI3wDxNJ7QPAzEVUczP8ntAnMPmlDYeTyWEBpjl100xLHDUUps'); // Replace with your actual publishable key

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.JSX.Element {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <AppProvider>
          <LocalizationProvider>
            <UserProvider>
              <ThemeProvider>
                <Elements stripe={stripePromise}>
                  {children}
                </Elements>
              </ThemeProvider>
            </UserProvider>
          </LocalizationProvider>
        </AppProvider>
      </body>
    </html>
  );
}
