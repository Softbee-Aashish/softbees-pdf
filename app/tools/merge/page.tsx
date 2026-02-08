import { constructMetadata } from '@/utils/metadata-map';
import MergePageClient from './client';

export const metadata = constructMetadata('merge');

export default function MergePage() {
    return <MergePageClient />;
}
