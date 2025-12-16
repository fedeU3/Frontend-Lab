import { useState, useEffect } from 'react';

type TheLabItem = any;

export function useTheLab() {
  const [TheLab, setTheLab] = useState<TheLabItem[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        // Attempt common endpoints; adjust to your API as needed
        const endpoints = ['/api/thelab', '/api/the-lab', '/thelab', '/the-lab'];
        let res: Response | null = null;
        for (const ep of endpoints) {
          try {
            res = await fetch(ep);
            if (res && res.ok) break;
          } catch {
            res = null;
          }
        }

        if (!res) {
          // No API available — provide empty array instead of throwing
          if (mounted) setTheLab([]);
        } else {
          const data = await res.json();
          if (mounted) setTheLab(Array.isArray(data) ? data : [data]);
        }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, []);

  return { TheLab, isLoading, error };
}

export default useTheLab;