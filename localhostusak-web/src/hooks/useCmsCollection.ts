import { useCallback, useEffect, useRef, useState } from 'react';

// initialItems: önbellekte hazır veri varsa verilir; yükleme durumu hiç açılmaz (skeleton/spinner yanıp sönmez)
export function useCmsCollection<T>(load: () => Promise<T[]>, initialItems?: T[]) {
  const [items, setItems] = useState<T[]>(initialItems ?? []);
  const [isLoading, setIsLoading] = useState(initialItems === undefined);
  const hadInitialItems = useRef(initialItems !== undefined);
  const [error, setError] = useState(false);
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let active = true;
    if (!hadInitialItems.current || revision > 0) setIsLoading(true);
    setError(false);
    load()
      .then((data) => {
        if (active) setItems(data);
      })
      .catch(() => {
        if (active) setError(true);
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });
    return () => { active = false; };
  }, [load, revision]);

  const retry = useCallback(() => setRevision((value) => value + 1), []);
  return { items, isLoading, error, retry };
}
