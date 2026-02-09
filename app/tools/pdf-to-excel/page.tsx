import { constructMetadata } from '@/utils/metadata-map';
import ClientExcelPage from './client';

export const metadata = constructMetadata('pdf-to-excel');

export default function Page() {
    return <ClientExcelPage />;
}
