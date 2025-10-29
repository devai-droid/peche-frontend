import FirstRankImgDefault from "@/assets/images/landing-page/1st_blank.jpeg"
import SecondRankImgDefault from "@/assets/images/landing-page/2nd_blank.jpeg"
import ThirdRankImgDefault from "@/assets/images/landing-page/3rd_blank.jpeg"
import FourthRankImgDefault from "@/assets/images/landing-page/4th_blank.jpeg"
import FifthRankImgDefault from "@/assets/images/landing-page/5th_blank.jpeg"
import { ordinalSuffixOf } from "@/lib/utils/util"
import { useTranslation } from "react-i18next"
import { Language } from "@/lib/locales/i18n.config"
import { MainProduct } from "@/lib/orval/model/mainProduct"
import { useMainProductControllerFindMany } from "@/lib/orval/main-products/main-products"
import CustomLink from "@/lib/components/custom-link.component"

const getImageUrlByLanguage = (product: MainProduct, language: Language): string => {
  switch (language) {
    case "en":
      return product.imageEN?.url || product.image.url || ""
    case "ja":
      return product.imageJA?.url || product.image.url || ""
    case "th":
      return product.imageTH?.url || product.image.url || ""
    case "zh":
      return product.imageZH?.url || product.image.url || ""
    default:
      return product.image.url || ""
  }
}

const Rank = ({ rank }: { rank: number }) => {
  return (
    <div tw="absolute md:text-md lg:text-lg px-2 bg-[#e9c293] text-white aspect-square">
      <div tw="mt-1">
        <span tw="inline-block md:text-xl lg:text-xxl">{rank}</span>
        {ordinalSuffixOf(rank)}
      </div>
    </div>
  )
}
const MostPopular = () => {
  const { i18n } = useTranslation()
  // 인기 상품 GET
  const { data: mainProductList } = useMainProductControllerFindMany({
    page: 1,
    limit: 10,
    status: "ACTIVE",
    sortBy: ["order"],
  })

  const products = mainProductList?.items
  const language = i18n.language as Language
  // TODO: Product 모델 detailPage: ProductDetailPage 변경 후 다시 작업
  const FirstRankImg =
    products && products[0] ? getImageUrlByLanguage(products[0], language) : FirstRankImgDefault
  const SecondRankImg =
    products && products[1] ? getImageUrlByLanguage(products[1], language) : SecondRankImgDefault
  const ThirdRankImg =
    products && products[2] ? getImageUrlByLanguage(products[2], language) : ThirdRankImgDefault
  const FourthRankImg =
    products && products[3] ? getImageUrlByLanguage(products[3], language) : FourthRankImgDefault
  const FifthRankImg =
    products && products[4] ? getImageUrlByLanguage(products[4], language) : FifthRankImgDefault

  const FirstRankDetailPage = products ? products[0]?.product?.detailPage : ""
  const SecondRankDetailPage = products ? products[1]?.product?.detailPage : ""
  const ThirdRankDetailPage = products ? products[2]?.product?.detailPage : ""
  const FourthRankDetailPage = products ? products[3]?.product?.detailPage : ""
  const FifthRankDetailPage = products ? products[4]?.product?.detailPage : ""

  return (
    <div tw="md:(grid grid-cols-4 aspect-[1/0.33] px-0) px-4">
      <div tw="row-span-2 order-1 hidden md:flex items-center justify-center bg-point">
        <div tw="text-white text-[2rem] leading-none tracking-tight mr-8">
          <span tw="font-semibold">MOST</span> <br />
          <span tw="font-semibold">POPULAR</span> <br />
          <span tw="font-light">PRODUCT</span>
        </div>
      </div>
      <div tw="row-span-2 order-2">
        <Rank rank={1} />
        <CustomLink to={`products/${FirstRankDetailPage !== "" && FirstRankDetailPage?.id}`}>
          <img src={FirstRankImg} alt="first-rank" tw="w-full h-full object-cover" />
        </CustomLink>
      </div>
      <div tw="order-3">
        <Rank rank={2} />
        <CustomLink to={`/products/${SecondRankDetailPage !== "" && SecondRankDetailPage?.id}`}>
          <img src={SecondRankImg} alt="second-rank" tw="w-full h-full object-cover" />
        </CustomLink>
      </div>
      <div tw="order-5">
        <Rank rank={3} />
        <CustomLink to={`/products/${ThirdRankDetailPage !== "" && ThirdRankDetailPage?.id}`}>
          <img src={ThirdRankImg} alt="third-rank" tw="w-full h-full object-cover" />
        </CustomLink>
      </div>
      <div tw="order-4">
        <Rank rank={4} />
        <CustomLink to={`/products/${FourthRankDetailPage !== "" && FourthRankDetailPage?.id}`}>
          <img src={FourthRankImg} alt="fourth-rank" tw="w-full h-full object-cover" />
        </CustomLink>
      </div>
      <div tw="order-6">
        <Rank rank={5} />
        <CustomLink to={`/products/${FifthRankDetailPage !== "" && FifthRankDetailPage?.id}`}>
          <img src={FifthRankImg} alt="fifth-rank" tw="w-full h-full object-cover" />
        </CustomLink>
      </div>
    </div>
  )
}

export default MostPopular
