import React from 'react'
import InvoicePage from './invoice'
import { type Metadata } from 'next'


export const metadata = { title: `Invoice | Dashboard ` } satisfies Metadata;

function page() {
  return (
    <InvoicePage />
  )
}

export default page
