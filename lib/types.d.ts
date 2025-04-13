interface CuneiformStore {
  getSigns: () => import("./data").CuneiformSign[]
  addSign: (sign: import("./data").CuneiformSign) => void
  refreshSigns: () => Promise<void>
}

declare global {
  interface Window {
    cuneiformStore: CuneiformStore
  }
}

export {}
