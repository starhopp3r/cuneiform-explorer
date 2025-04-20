import { CuneiformSign } from "./types";

declare global {
  interface Window {
    cuneiformStore: {
      signs: CuneiformSign[];
      setSigns: (signs: CuneiformSign[]) => void;
    };
  }
} 