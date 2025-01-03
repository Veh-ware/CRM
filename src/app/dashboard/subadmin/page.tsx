import React from 'react';
import SubAdminPage from './subadmin';
import { type Metadata } from 'next';

export const metadata = { title: `Sub Admins | Dashboard` } satisfies Metadata;

function Page() {
    return <SubAdminPage />;
}

export default Page;
