import React from 'react'
import Employee from './client';
import type { Metadata } from 'next';

export const metadata = { title: `Client | Dashboard ` } satisfies Metadata;

function page() {
  return (
    <Employee />
  )
}

export default page
