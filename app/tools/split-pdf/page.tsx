import { constructMetadata } from '@/utils/metadata-map';
import ClientSplitPage from './client';

export const metadata = constructMetadata('split-pdf');

export default function Page() {
    return <ClientSplitPage />;
}
