import { constructMetadata } from '@/utils/metadata-map';
import OrganizerPageClient from './client';

export const metadata = constructMetadata('organize');

export default function OrganizerPage() {
    return <OrganizerPageClient />;
}
