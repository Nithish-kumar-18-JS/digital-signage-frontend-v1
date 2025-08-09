'use client';

import { useParams } from 'next/navigation';

export default function Page() {
    const { type } = useParams();
    return (
        <div>
            <h1>{type}</h1>
        </div>
    );
}