import React from "react"
import tw from "twin.macro"
import { Dropdown, DropdownItem, Icon } from "@/design-system/components"
import { DropDownIcon } from "@/assets/icon"

interface Item {
  key: string
  label: string
  value?: string
}

interface Props {
  items: Item[]
  onSelected: (item: Item) => void
  selectedItemKey?: string
}

const TypeFilter: React.FC<Props> = ({ ...props }: Props) => {
  const { items, selectedItemKey, onSelected } = props
  const defaultItem = items.find((item) => item.key === selectedItemKey) ?? items[0]
  const [selectedItem, setSelectedItem] = React.useState<Item>(defaultItem)

  return (
    <Dropdown
      element={({ openDropdown, open }) => (
        <button onClick={openDropdown} tw="flex items-center pb-1 pt-1.5">
          <div tw="text-md font-bold font-nanumgothic mr-2">{selectedItem.label}</div>
          <Icon
            icon={DropDownIcon}
            tw="text-[#838383] -mr-2"
            css={open ? tw`transform rotate-180` : tw`transform rotate-0`}
          />
        </button>
      )}>
      {(closeDropdown) =>
        items?.map((item) => (
          <DropdownItem
            key={item.key}
            onClick={() => {
              closeDropdown()
              setSelectedItem(item)
              onSelected(item)
            }}
            selected={item.key === selectedItem.key}>
            {item.label}
          </DropdownItem>
        ))
      }
    </Dropdown>
  )
}

export default TypeFilter
