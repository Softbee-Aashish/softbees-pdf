import { constructMetadata } from '@/utils/metadata-map';
import ClientWordToPdfPage from './client';

export const metadata = constructMetadata('word-to-pdf');

export default function Page() {
    return <ClientWordToPdfPage />;
}
