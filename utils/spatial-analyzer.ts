import { TextItem } from 'pdfjs-dist/types/src/display/api';

export interface SpatialTextItem {
    str: string;
    x: number;      // Normalized X (72 DPI)
    y: number;      // Normalized Y (72 DPI, Top-Left origin)
    width: number;
    height: number;
    fontName: string;
    fontSize: number;
    color: string;  // RGB Hex
    hasEOL: boolean;
}

export interface FixedLine {
    y: number;      // The locked Y-coordinate for this line
    height: number; // Max height of items in this line
    items: SpatialTextItem[];
}

export interface VirtualPageGrid {
    pageIndex: number;
    width: number;
    height: number;
    lines: FixedLine[];
    gutters: { start: number; end: number }[]; // Vertical empty strips
}

export class SpatialAnalyzer {
    private dpiScale: number = 1.0; // PDF units are usually 1/72 inch, so 1.0 is standard

    constructor() { }

    /**
     * Normalizes a raw PDF page into a structured Virtual Page Grid.
     * @param rawItems Items from pdf.getPage().getTextContent()
     * @param viewport The PDF page viewport (for height inversion)
     */
    public analyzePage(rawItems: any[], viewport: any): VirtualPageGrid {
        const spatialItems: SpatialTextItem[] = rawItems.map(item => this.normalizeItem(item, viewport));

        // 1. Line Locking (Y-Clustering)
        const lines = this.clusterLines(spatialItems);

        // 2. Gutter Detection (Vertical Analysis)
        const gutters = this.detectGutters(lines, viewport.width);

        return {
            pageIndex: 0, // Set by caller
            width: viewport.width,
            height: viewport.height,
            lines,
            gutters
        };
    }

    private normalizeItem(item: any, viewport: any): SpatialTextItem {
        // Transform[4] is X, Transform[5] is Y (bottom-left origin)
        const tx = item.transform;
        const x = tx[4];
        const rawY = tx[5];

        // Convert to Top-Left origin
        const y = viewport.height - rawY;

        return {
            str: item.str,
            x: x,
            y: y - item.height, // Adjust because PDF Y is baseline, we want top-left
            width: item.width,
            height: item.height,
            fontName: item.fontName,
            fontSize: item.height, // Approximate, should use transform[0]
            color: '#000000', // Default, needs advanced op-list parsing for color
            hasEOL: item.hasEOL
        };
    }

    private clusterLines(items: SpatialTextItem[]): FixedLine[] {
        const tolerance = 2.0; // 2pt tolerance
        const lines: FixedLine[] = [];

        // Sort by Y to process top-down
        const sortedItems = [...items].sort((a, b) => a.y - b.y);

        for (const item of sortedItems) {
            if (!item.str.trim()) continue;

            // Find existing line bucket
            let added = false;
            for (const line of lines) {
                if (Math.abs(line.y - item.y) < tolerance) {
                    line.items.push(item);
                    line.height = Math.max(line.height, item.height);
                    added = true;
                    break;
                }
            }

            if (!added) {
                lines.push({
                    y: item.y,
                    height: item.height,
                    items: [item]
                });
            }
        }

        // Sort items within each line by X
        lines.forEach(line => {
            line.items.sort((a, b) => a.x - b.x);
        });

        // Sort lines themselves
        return lines.sort((a, b) => a.y - b.y);
    }

    private detectGutters(lines: FixedLine[], pageWidth: number): { start: number; end: number }[] {
        // Project all X-intervals
        const bucketSize = 2; // 2pt
        const numBuckets = Math.ceil(pageWidth / bucketSize);
        const buckets = new Uint8Array(numBuckets).fill(0);

        lines.forEach(line => {
            line.items.forEach(item => {
                const startB = Math.floor(item.x / bucketSize);
                const endB = Math.floor((item.x + item.width) / bucketSize);
                for (let b = startB; b <= endB; b++) {
                    if (b >= 0 && b < numBuckets) buckets[b] = 1;
                }
            });
        });

        const gutters: { start: number; end: number }[] = [];
        let inGutter = false;
        let gutterStart = 0;

        for (let b = 0; b < numBuckets; b++) {
            if (buckets[b] === 0 && !inGutter) {
                inGutter = true;
                gutterStart = b * bucketSize;
            } else if (buckets[b] === 1 && inGutter) {
                inGutter = false;
                if ((b * bucketSize) - gutterStart > 10) { // Min gutter width 10pt
                    gutters.push({ start: gutterStart, end: b * bucketSize });
                }
            }
        }

        return gutters;
    }
}
