import { constructMetadata } from '@/utils/metadata-map';
import CompressPageClient from './client';

export const metadata = constructMetadata('compress');

export default function CompressPage() {
  return <CompressPageClient />;
}
