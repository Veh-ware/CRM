import React from 'react'
import Employee from './employee';
import type { Metadata } from 'next';

export const metadata = { title: `Employee | Dashboard ` } satisfies Metadata;

function page() {
  return (
    <Employee />
  )
}

export default page
