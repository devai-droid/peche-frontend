import { Stage } from "@/lib/env"

export const DEFAULT_CONSULTATION_PRODUCT_ID = {
  [Stage.Local]: "e00f590d-5920-4297-9dc6-41cdf5438ec9",
  [Stage.Development]: "22c0f372-754e-4f5a-93ea-9ae567fd8184",
  [Stage.Production]: "22c0f372-754e-4f5a-93ea-9ae567fd8184",
  [Stage.Staging]: "22c0f372-754e-4f5a-93ea-9ae567fd8184",
}

export const DEFAULT_PACKAGE_USE_PRODUCT_ID = {
  [Stage.Local]: "5e8c9d2f-1a3b-4c5d-8e6f-7a9b0c1d2e3f",
  [Stage.Development]: "5e8c9d2f-1a3b-4c5d-8e6f-7a9b0c1d2e3f",
  [Stage.Production]: "5e8c9d2f-1a3b-4c5d-8e6f-7a9b0c1d2e3f",
  [Stage.Staging]: "5e8c9d2f-1a3b-4c5d-8e6f-7a9b0c1d2e3f",
}
