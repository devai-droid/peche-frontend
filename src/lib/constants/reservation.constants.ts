import { Stage } from "@/lib/env"

export const DEFAULT_CONSULTATION_PRODUCT_ID = {
  [Stage.Local]: "e00f590d-5920-4297-9dc6-41cdf5438ec9",
  [Stage.Development]: "22c0f372-754e-4f5a-93ea-9ae567fd8184",
  [Stage.Production]: "22c0f372-754e-4f5a-93ea-9ae567fd8184",
  [Stage.Staging]: "22c0f372-754e-4f5a-93ea-9ae567fd8184",
}
