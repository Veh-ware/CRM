import PaymentPage from "./paymentPage"
import type { Metadata } from 'next';

export const metadata = { title: `Payment` } satisfies Metadata;

export default function page() {
    return (
        <>
            <PaymentPage />
        </>
    )
}

