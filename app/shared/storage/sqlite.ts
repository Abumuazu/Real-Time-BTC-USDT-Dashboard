import SQLite from "react-native-sqlite-storage"
SQLite.enablePromise(true)
const DB_NAME = "btcApp.db"
export async function getDB() {
  return SQLite.openDatabase({ name: DB_NAME, location: "default" })
}
type SQLiteDatabase = Awaited<ReturnType<typeof getDB>>
let sparklineInit: Promise<SQLiteDatabase> | null = null
export async function initSparkline() {
  if (!sparklineInit) {
    sparklineInit = (async () => {
      const db = await getDB()
      await db.executeSql(
        `CREATE TABLE IF NOT EXISTS sparkline ( ts INTEGER PRIMARY KEY, last REAL NOT NULL )`,
      )
      await db.executeSql(`CREATE INDEX IF NOT EXISTS idx_spark_ts ON sparkline(ts)`)
      return db
    })()
  }
  return sparklineInit
}
export async function insertTick(ts: number, last: number) {
  const db = await initSparkline()
  await db.executeSql("INSERT OR REPLACE INTO sparkline (ts, last) VALUES (?,?)", [ts, last])
  const cutoff = ts - 120_000
  await db.executeSql("DELETE FROM sparkline WHERE ts < ?", [cutoff])
}
export type SparkPoint = { ts: number; last: number }
export async function getLast60s(now: number): Promise<SparkPoint[]> {
  const db = await initSparkline()
  const cutoff = now - 60_000
  const res = await db.executeSql("SELECT ts,last FROM sparkline WHERE ts >= ? ORDER BY ts ASC", [
    cutoff,
  ])
  const rows = res[0].rows
  const out: SparkPoint[] = []
  for (let i = 0; i < rows.length; i++) {
    const r = rows.item(i)
    out.push({ ts: r.ts, last: r.last })
  }
  return out
}
