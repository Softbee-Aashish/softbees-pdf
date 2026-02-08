import { constructMetadata } from '@/utils/metadata-map';
import PdfToJpgPageClient from './client';

export const metadata = constructMetadata('pdf-to-jpg');

export default function PdfToJpgPage() {
    return <PdfToJpgPageClient />;
}
