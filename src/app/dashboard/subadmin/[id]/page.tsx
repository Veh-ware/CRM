import React from 'react';
import SubAdminId from './subAdminId';
import { type Metadata } from 'next';

export const metadata = { title: `Sub Admins | Details` } satisfies Metadata;

function Page() {
    return <SubAdminId />;
}

export default Page;
