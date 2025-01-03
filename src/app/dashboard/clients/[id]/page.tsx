import React from 'react'
import ClientDetails from './clientDetails'
import type { Metadata } from 'next';


export const metadata = { title: `ClientDetails | Dashboard` } satisfies Metadata;

function Page() {
  return (
    <ClientDetails /> 
  )
}

export default Page
