import { constructMetadata } from '@/utils/metadata-map';
import JpgToPdfPageClient from './client';

export const metadata = constructMetadata('jpg-to-pdf');

export default function JpgToPdfPage() {
    return <JpgToPdfPageClient />;
}
