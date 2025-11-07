declare module "pako" {
  export interface InflateOptions {
    to?: "string" | undefined
  }

  export function inflate(data: Uint8Array, options?: InflateOptions): string | Uint8Array
}

