/* eslint-disable @typescript-eslint/no-explicit-any */
export interface AxiosErrorData {
  message: string
  statusCode: number
}

export interface AxiosValidateErrorData {
  children: any[]
  constraints: Record<string, any>
  property: string
  value: string
}
