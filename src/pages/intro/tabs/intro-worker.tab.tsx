import AppMaxWidth from "@/lib/components/layout/app-max-width.component"
import tw from "twin.macro"
import workerThumbnail from "@/assets/images/intro/worker.webp"
import useImageLoader from "@/lib/hooks/use-image-loader"
import { useMemberControllerFindMany } from "@/lib/orval/members/members"

const imgCss = tw`aspect-square bg-point rounded-full`

const WorkerImg = ({ src }: { src?: string }) => {
  const { isLoading, showSkeleton, setShowSkeleton } = useImageLoader(src)

  return isLoading ? (
    <p css={imgCss} />
  ) : (
    <img
      src={showSkeleton ? workerThumbnail : src}
      css={imgCss}
      tw="object-cover"
      alt="avatar"
      onError={() => {
        setShowSkeleton(true)
      }}
    />
  )
}

const Worker = ({ src, name, position }: { src?: string; name?: string; position?: string }) => (
  <div tw="text-center">
    <WorkerImg src={src} />
    <div tw="font-nanumgothic leading-none">
      <p tw="text-sm text-[#3d3d3d] my-2">{position}</p>
      <p tw="text-lg lg:text-xl font-extrabold">{name}</p>
    </div>
  </div>
)

const IntroWorker = () => {
  const { data: consultants } = useMemberControllerFindMany({
    page: 1,
    occupation: "상담실장",
    status: "ACTIVE",
    sortBy: ["order"],
    limit: 100,
  })

  const { data: coordinators } = useMemberControllerFindMany({
    page: 1,
    occupation: "코디네이터",
    status: "ACTIVE",
    sortBy: ["order"],
    limit: 100,
  })

  const { data: dermaManagers } = useMemberControllerFindMany({
    page: 1,
    occupation: "피부관리사",
    status: "ACTIVE",
    sortBy: ["order"],
    limit: 100,
  })

  const { data: assistants } = useMemberControllerFindMany({
    page: 1,
    occupation: "어시스트",
    status: "ACTIVE",
    sortBy: ["order"],
    limit: 100,
  })

  return (
    <AppMaxWidth>
      <div tw="grid grid-cols-3 md:grid-cols-5 gap-x-4 gap-y-6 md:gap-y-10">
        {consultants?.items?.map((consultant, index) => (
          <Worker
            key={index}
            src={consultant.image.url}
            name={consultant.name}
            position={consultant.occupation}
          />
        ))}
        {coordinators?.items?.map((coordinator, index) => (
          <Worker
            key={index}
            src={coordinator.image.url}
            name={coordinator.name}
            position={coordinator.occupation}
          />
        ))}
        {dermaManagers?.items?.map((manager, index) => (
          <Worker
            key={index}
            src={manager.image.url}
            name={manager.name}
            position={manager.occupation}
          />
        ))}
        {assistants?.items?.map((assistant, index) => (
          <Worker
            key={index}
            src={assistant.image.url}
            name={assistant.name}
            position={assistant.occupation}
          />
        ))}
      </div>
    </AppMaxWidth>
  )
}

export default IntroWorker
