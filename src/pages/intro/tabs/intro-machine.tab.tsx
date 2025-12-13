import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import { useEquipmentControllerFindMany } from "@/lib/orval/equipments/equipments"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import { Equipment } from "@/lib/orval/model"

const Machine = ({
  src,
  name,
  subName,
  description,
}: {
  src?: string
  name?: string
  subName?: string
  description?: string
}) => (
  <div tw="rounded-lg border border-[#D0D0D0] shadow-md overflow-hidden p-4">
    <img src={src} tw="aspect-square" alt="machine" />
    <div tw="mt-4">
      <div tw="text-[#333] font-nanumgothic">
        <p tw="text-lg lg:text-xl font-bold leading-tight">{name}</p>
        <p tw="text-sm text-[#8D7B64] mt-2 mb-4">{subName}</p>
        <p tw="text-sm leading-tight">{description}</p>
      </div>
    </div>
  </div>
)

const IntroMachine = () => {
  const { i18n } = useTranslation()
  const language = i18n.language as Language
  const { data: equipments } = useEquipmentControllerFindMany({
    page: 1,
    sortBy: ["order"],
    status: "ACTIVE",
    limit: 100,
  })

  const getLocalizedName = (equipment: Equipment, lang: string) => {
    switch (lang) {
      case "en":
        return equipment.nameEN || equipment.name
      case "ja":
        return equipment.nameJA || equipment.name
      case "th":
        return equipment.nameTH || equipment.name
      case "zh":
        return equipment.nameZH || equipment.name
      case "zh-TW":
        return equipment.nameZHTW || equipment.name
      default:
        return equipment.name
    }
  }

  const getLocalizedDescriptionFirst = (equipment: Equipment, lang: string) => {
    switch (lang) {
      case "en":
        return equipment.descriptionFirstEN || equipment.descriptionFirst
      case "ja":
        return equipment.descriptionFirstJA || equipment.descriptionFirst
      case "th":
        return equipment.descriptionFirstTH || equipment.descriptionFirst
      case "zh":
        return equipment.descriptionFirstZH || equipment.descriptionFirst
      case "zh-TW":
        return equipment.descriptionFirstZHTW || equipment.descriptionFirst
      default:
        return equipment.descriptionFirst
    }
  }

  const getLocalizedDescriptionSecond = (equipment: Equipment, lang: string) => {
    switch (lang) {
      case "en":
        return equipment.descriptionSecondEN || equipment.descriptionSecond
      case "ja":
        return equipment.descriptionSecondJA || equipment.descriptionSecond
      case "th":
        return equipment.descriptionSecondTH || equipment.descriptionSecond
      case "zh":
        return equipment.descriptionSecondZH || equipment.descriptionSecond
      case "zh-TW":
        return equipment.descriptionSecondZHTW || equipment.descriptionSecond
      default:
        return equipment.descriptionSecond
    }
  }
  return (
    <AppMaxWidth>
      <div tw="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-6 md:gap-y-8">
        {equipments?.items?.map((equipment, index) => (
          <Machine
            key={index}
            src={equipment.image.url}
            name={getLocalizedName(equipment, language)}
            subName={getLocalizedDescriptionFirst(equipment, language)}
            description={getLocalizedDescriptionSecond(equipment, language)}
          />
        ))}
      </div>
    </AppMaxWidth>
  )
}

export default IntroMachine
