interface CuneiformStore {
  getSigns: () => import("./data").CuneiformSign[]
  addSign: (sign: import("./data").CuneiformSign) => void
}

declare global {
  interface Window {
    cuneiformStore?: CuneiformStore
  }
}

export {}
