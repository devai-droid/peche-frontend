import { Button } from "@/design-system/components"
import Page from "@/lib/components/layout/page.component"
import { useTranslation } from "react-i18next"
import useCustomNavigate from "@/lib/hooks/use-custom-navigate"

const ReservationComplete = () => {
  const { t } = useTranslation()
  const navigate = useCustomNavigate()

  return (
    <Page>
      <div tw="flex flex-col items-center justify-center h-full text-center py-20">
        <div tw="text-lg mt-8 mb-3">{t("reservePage.reservationCompleteText")}</div>
        {/* <div tw="text-lg text-[#FF0000]">{t("reservePage.checkConfirmationText")}</div>
        <div tw="mt-6 mb-10 whitespace-pre-wrap text-[#999]">{t("reservePage.contactMessage")}</div> */}

        <Button
          tw="min-w-[12rem] text-[16px] md:text-[18px]"
          style={{ variant: "filled", color: "point", size: "md" }}
          onClick={() => navigate("/reservation")}>
          {t("reservePage.reservationCheck")}
        </Button>
      </div>
    </Page>
  )
}

export default ReservationComplete
