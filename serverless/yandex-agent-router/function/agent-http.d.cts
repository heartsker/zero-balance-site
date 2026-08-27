export type Representation = 'html' | 'markdown';

export function negotiateRepresentation(acceptHeader: string | null): Representation | null;
export function markdownPathFor(pathname: string): string;
