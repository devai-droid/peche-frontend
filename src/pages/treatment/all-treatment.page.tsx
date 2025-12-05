import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import Page from "@/lib/components/layout/page.component"
import { dummyTreatments } from "@/pages/treatment/dummyTreatments"
import tw from "twin.macro"

const PageWrapper = tw.div`
  pt-[120px] pb-20
  max-w-[1200px] mx-auto
`

const Title = tw.h2`
  text-[28px] font-bold mb-8 text-center
`

const TreatmentImage = tw.img`
  w-full max-w-[800px] mx-auto rounded-lg shadow
`

const AllTreatmentPage = () => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get("type")

  const [selected, setSelected] = useState<any>(null)

  // 🔥 eslint-friendly 버전
  const findChildById = (id: string) =>
    dummyTreatments.flatMap((g) => g.children).find((c) => c.id === id) ?? null

  const getDefaultChild = () => dummyTreatments[0].children[0]

  useEffect(() => {
    if (type) {
      const found = findChildById(type)
      setSelected(found ?? getDefaultChild())
    } else {
      setSelected(getDefaultChild())
    }
  }, [type])

  return (
    <Page hiddenFooter={false} bottomCartExists={false}>
      <AppMaxWidth tw="max-lg:p-0">
        <PageWrapper>
          <Title>{selected?.name}</Title>
          {selected && <TreatmentImage src={selected.image} alt={selected.name} />}
        </PageWrapper>
      </AppMaxWidth>
    </Page>
  )
}

export default AllTreatmentPage
