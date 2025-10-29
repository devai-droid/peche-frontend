import { LocalStorageKeys } from "../constants/local-storage-key.constant"

export class LocalStorage {
  static set(key: LocalStorageKeys, value: string): void {
    localStorage.setItem(key, value)
  }

  static get(key: LocalStorageKeys): string | null {
    return localStorage.getItem(key)
  }

  static remove(key: LocalStorageKeys): void {
    localStorage.removeItem(key)
  }

  static clear(): void {
    localStorage.clear()
  }
}
