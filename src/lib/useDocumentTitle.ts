import { useEffect } from 'react';

export function useDocumentTitle(title?: string) {
  useEffect(() => {
    document.title = title
      ? `${title} — Exclusive Multimedia Group (EMG)`
      : 'Exclusive Multimedia Group (EMG) — Create • Capture • Connect';
  }, [title]);
}
