import React from "react"
import { dummyTreatments } from "./dummyTreatments"
import tw from "twin.macro"

const Wrapper = tw.div`
  absolute left-0 top-[55px]
  w-full 
  bg-white border-t border-gray-200 
  shadow-lg z-[1000]
  py-6
  flex flex-row items-start gap-0 px-8
`

const GroupTitle = tw.div`
  px-8 pt-4 pb-2 text-[14px] font-semibold text-gray-700
`

const Item = tw.button`
  px-6 py-0 text-left text-[13px] md:text-[15px] hover:text-primary tracking-tight leading-[150%] text-center
  transition-colors duration-200 block w-full
`

interface Props {
  onSelect: (item: any) => void
  selectedId: string | null
  selectedGroupId: string | null
}

const AllTreatmentDropdown = React.forwardRef<HTMLDivElement, Props>(
  ({ onSelect, selectedId, selectedGroupId }, ref) => {
    return (
      <Wrapper ref={ref}>
        {dummyTreatments.map((group) => (
          <div key={group.id} tw="flex flex-col gap-2 min-w-[160px] text-center">
            <div
              tw="text-[13px] md:text-[15px] font-semibold text-neutral70 text-center"
              css={[group.id === selectedGroupId && tw`text-primary`]}>
              {group.name}
            </div>

            {group.children.map((child) => (
              <Item
                key={child.id}
                onClick={() => onSelect(child)}
                css={[child.id === selectedId && tw`text-primary`]}>
                {child.name}
              </Item>
            ))}
          </div>
        ))}
      </Wrapper>
    )
  },
)

// ⭐ IMPORTANT ⭐
// forwardRef 쓰면 반드시 displayName 지정해야 eslint 오류 안 남
AllTreatmentDropdown.displayName = "AllTreatmentDropdown"

export default AllTreatmentDropdown
