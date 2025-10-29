import React, { ForwardRefRenderFunction } from "react"

import { Input, Typography } from "@/design-system/components"

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const InputComponent: ForwardRefRenderFunction<HTMLInputElement, Props> = (
  { label, error, ...rest },
  ref,
) => (
  <label tw="flex flex-col gap-3 mt-4 pt-3">
    {label && <Typography size="sm">{label}</Typography>}
    <Input ref={ref} type="text" {...rest} />
    {error && <Typography size="sm">{error}</Typography>}
  </label>
)

const UseFormInput = React.forwardRef(InputComponent)
export default UseFormInput
