import { useEffect, useState } from "react";
import { useTickerQuery } from "./api";
import { getLast60s, insertTick } from "../../shared/storage/sqlite";
export function useSparkline(symbol: string) {
  const { data } = useTickerQuery(symbol);
  const [points, setPoints] = useState<{ ts: number; last: number }[]>([]);
  useEffect(() => { let mounted = true; (async () => {
    if (data?.ts && data?.last != null) { await insertTick(data.ts, data.last); const p = await getLast60s(data.ts); if (mounted) setPoints(p); }
  })(); return () => { mounted = false; }; }, [data?.ts, data?.last]);
  return points;
}
