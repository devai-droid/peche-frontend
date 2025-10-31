import React, { useState } from "react"
import tw, { styled } from "twin.macro"
import { ChevronDownIcon } from "@/assets/icon"

// 실제 구조 예시
interface DetailPage {
  name: string
}

interface TreatmentCategory {
  name: string
  detailPages?: DetailPage[]
}

interface MenuSection {
  title: string
  items?: TreatmentCategory[]
}

const dummyMenu: MenuSection[] = [
  { title: "페슈의원 소개" },
  {
    title: "전체 시술",
    items: [
      {
        name: "탄력 리프팅",
        detailPages: [{ name: "시술명" }, { name: "시술명" }, { name: "시술명" }],
      },
      {
        name: "미백 색조 홍조",
        detailPages: [{ name: "시술명" }, { name: "시술명" }],
      },
      { name: "보톡스 지방분해" },
      { name: "필러" },
    ],
  },
  { title: "가격·이벤트" },
  { title: "블로그" },
]

const AccordionContainer = tw.div`w-full bg-white border-t border-[#EBECEF]`
const SectionHeader = styled.button(({ isOpen }: { isOpen: boolean }) => [
  tw`w-full flex justify-between items-center py-4 px-6 text-left text-[16px] font-semibold transition-colors`,
])
const SubMenu = tw.ul`bg-primary text-white text-[15px] font-medium`
const SubItemHeader = styled.button(({ isOpen }: { isOpen: boolean }) => [
  tw`w-full flex justify-between items-center py-3 px-8 text-left font-semibold transition-all duration-200`,
  isOpen ? tw`opacity-80` : tw`opacity-100`,
])
const DetailList = tw.ul`bg-primary text-white text-[14px] font-normal`
const DetailItem = tw.li`py-2 px-10`

const MobileAccordionMenu = () => {
  const [openSection, setOpenSection] = useState<number | null>(null)
  const [openCategory, setOpenCategory] = useState<number | null>(null)

  return (
    <AccordionContainer>
      {dummyMenu.map((section, sectionIdx) => {
        const sectionOpen = openSection === sectionIdx
        return (
          <div key={section.title}>
            {/* 1️⃣ 1단계: 상위 메뉴 */}
            <SectionHeader
              isOpen={sectionOpen}
              onClick={() => setOpenSection(sectionOpen ? null : sectionIdx)}>
              {section.title}

              <ChevronDownIcon
                width={18}
                height={18}
                css={[
                  tw`text-[#DA7F67] transition-transform duration-200`,
                  sectionOpen && tw`rotate-180`,
                ]}
              />
            </SectionHeader>

            {/* 2️⃣ 2단계: 시술 카테고리 목록 */}
            {sectionOpen && section.items && (
              <SubMenu>
                {section.items.map((cat, catIdx) => {
                  const catOpen = openCategory === catIdx
                  const hasDetails = cat.detailPages && cat.detailPages.length > 0
                  return (
                    <div key={cat.name}>
                      <SubItemHeader
                        isOpen={catOpen}
                        onClick={() =>
                          hasDetails ? setOpenCategory(catOpen ? null : catIdx) : undefined
                        }>
                        {cat.name}
                        {hasDetails && (
                          <ChevronDownIcon
                            width={16}
                            height={16}
                            css={[
                              tw`text-white transition-transform duration-200`,
                              catOpen && tw`rotate-180`,
                            ]}
                          />
                        )}
                      </SubItemHeader>

                      {/* 3️⃣ 3단계: 시술명 목록 */}
                      {catOpen && hasDetails && (
                        <DetailList>
                          {cat.detailPages!.map((d) => (
                            <DetailItem key={d.name}>{d.name}</DetailItem>
                          ))}
                        </DetailList>
                      )}
                    </div>
                  )
                })}
              </SubMenu>
            )}
          </div>
        )
      })}
    </AccordionContainer>
  )
}

export default MobileAccordionMenu
