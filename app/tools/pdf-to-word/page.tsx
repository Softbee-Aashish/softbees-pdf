import { constructMetadata } from '@/utils/metadata-map';
import ClientWordPage from './client';

export const metadata = constructMetadata('pdf-to-word');

export default function Page() {
    return <ClientWordPage />;
}
