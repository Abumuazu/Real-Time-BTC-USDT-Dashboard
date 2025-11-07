declare module "react-native-sqlite-storage" {
  export type SQLiteStatementResult = {
    rows: {
      length: number
      item: (index: number) => any
    }
  }

  export type SQLiteDatabase = {
    executeSql: (sqlStatement: string, params?: any[]) => Promise<SQLiteStatementResult[]>
    close: () => Promise<void>
  }

  export type SQLiteOpenParams = {
    name: string
    location: string
  }

  export interface SQLiteStatic {
    enablePromise: (flag: boolean) => void
    openDatabase: (params: SQLiteOpenParams) => Promise<SQLiteDatabase>
  }

  const SQLite: SQLiteStatic

  export default SQLite
}

