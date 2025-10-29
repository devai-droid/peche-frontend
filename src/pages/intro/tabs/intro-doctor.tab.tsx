import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import tw from "twin.macro"
import doctorThumbnail from "@/assets/images/intro/doctor.webp"
import useImageLoader from "@/lib/hooks/use-image-loader"
import { useMemberControllerFindMany } from "@/lib/orval/members/members"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import { Member } from "@/lib/orval/model"

const imgCss = tw`aspect-[1/1.3] bg-point`

const DoctorImg = ({ src }: { src?: string }) => {
  const { isLoading, setShowSkeleton, showSkeleton } = useImageLoader(src)

  return isLoading ? (
    <p css={imgCss} />
  ) : (
    <img
      src={showSkeleton ? doctorThumbnail : src}
      css={imgCss}
      tw="object-cover"
      alt="avatar"
      onError={() => {
        setShowSkeleton(true)
      }}
    />
  )
}

const Doctor = ({ src, name, position }: { src?: string; name?: string; position?: string }) => (
  <div tw="rounded-lg border border-[#D0D0D0] shadow-md aspect-[1/1.6] overflow-hidden flex flex-col">
    <DoctorImg src={src} />
    <div tw="flex-1 flex justify-center items-center">
      <div tw="text-[#3d3d3d] font-nanumgothic">
        <span tw="text-lg lg:text-xl font-extrabold">{name}</span>
        <span tw="inline-block w-2" />
        <span tw="text-sm text-gray-500">{position}</span>
      </div>
    </div>
  </div>
)

const IntroDoctor = () => {
  const { t, i18n } = useTranslation()
  const language = i18n.language as Language
  const { data: doctors } = useMemberControllerFindMany({
    page: 1,
    occupation: "원장",
    status: "ACTIVE",
    sortBy: ["order"],
    limit: 100,
  })

  const getLocalizedName = (member: Member, lang: string) => {
    switch (lang) {
      case "en":
        return member.nameEN || member.name
      case "ja":
        return member.nameJA || member.name
      case "th":
        return member.nameTH || member.name
      case "zh":
        return member.nameZH || member.name
      default:
        return member.name
    }
  }

  const getLocalizedOccupation = (occupation: string) =>
    t(`occupations.${occupation}`, { defaultValue: occupation })

  return (
    <AppMaxWidth>
      <div tw="grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4 md:(gap-x-12 gap-y-8)">
        {doctors?.items?.map((doctor, index) => (
          <Doctor
            key={index}
            src={doctor.image.url}
            name={getLocalizedName(doctor, language)}
            position={getLocalizedOccupation(doctor.occupation)}
          />
        ))}
      </div>
    </AppMaxWidth>
  )
}

export default IntroDoctor
