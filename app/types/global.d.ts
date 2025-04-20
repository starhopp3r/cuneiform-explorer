import { CuneiformSign } from "@/lib/data";

declare global {
  interface Window {
    cuneiformStore: {
      getSigns: () => CuneiformSign[];
      addSign: (sign: CuneiformSign) => void;
      refreshSigns: () => Promise<void>;
    };
  }
} 