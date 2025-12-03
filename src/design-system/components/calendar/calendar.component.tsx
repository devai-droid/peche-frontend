/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo } from "react"
import { LocalizationProvider, DateCalendar, DateCalendarProps } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import dayjs, { Dayjs } from "dayjs"
import "dayjs/locale/ko"
import "dayjs/locale/ja"
import "dayjs/locale/zh"
import "dayjs/locale/en"
import "dayjs/locale/th"
import { Language } from "@/lib/locales/i18n.config"
import { useTranslation } from "react-i18next"

export interface CalendarProp extends DateCalendarProps<Dayjs> {
  disabledDate?: Array<string>
  footer?: React.ReactNode
}

const Calendar = ({ disabledDate, footer, ...props }: CalendarProp) => {
  const disabledDates = useMemo(
    () => disabledDate?.map((date) => dayjs(date)) || [],
    [disabledDate],
  )

  const { i18n } = useTranslation()
  const language = i18n.language as Language
  const isChinese = language === "zh"

  return (
    <div>
      <LocalizationProvider adapterLocale={language} dateAdapter={AdapterDayjs}>
        <DateCalendar
          className="!w-full !max-h-[28rem] !h-[28rem]"
          sx={{
            /* ----------------------
             * 헤더 스타일
             * ---------------------- */
            ".MuiPickersCalendarHeader-root": {
              marginTop: "1rem",
              marginBottom: "1rem",
              maxHeight: "1.875rem",
              minHeight: "1.875rem",
              justifyContent: "center",
              position: "relative",
            },
            ".MuiPickersCalendarHeader-labelContainer": {
              margin: "0 auto !important",
              textAlign: "center",
              fontFamily: "Pretendard",
              fontSize: "1.125rem",
              fontWeight: 400,
            },
            ".MuiPickersCalendarHeader-switchViewButton": {
              display: "none",
            },

            /* ----------------------
             * 요일 / 날짜 정렬
             * ---------------------- */
            ".MuiDayCalendar-header, .MuiDayCalendar-weekContainer": {
              justifyContent: "space-around",
              margin: "1rem 0",
            },
            ".MuiDayCalendar-root": {
              borderTop: "1px solid #ddd",
            },
            ".MuiDayCalendar-header": {
              marginBottom: 0,
            },
            ".MuiPickersArrowSwitcher-root": {
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
            },

            ".MuiPickersArrowSwitcher-root .MuiIconButton-root": {
              pointerEvents: "auto",
            },

            /* ----------------------
             * 날짜 공통 스타일
             * ---------------------- */
            ".MuiPickersDay-root, .MuiDayCalendar-weekDayLabel": {
              fontFamily: "Pretendard",
              fontWeight: 400,
              fontSize: "1rem",
              width: "2.25rem",
              height: "2.25rem",
              position: "relative", // pseudo-element 위한 포지션
            },

            /* ----------------------
             * 날짜 선택 스타일
             * ---------------------- */
            ".MuiPickersDay-root.Mui-selected": {
              color: "white !important",
              backgroundColor: "transparent !important",
              fontWeight: 400,
              position: "relative",
              zIndex: 1,
            },

            ".MuiPickersDay-root.Mui-selected::before": {
              content: '""',
              position: "absolute",
              inset: 0,
              margin: "auto",
              width: "4.5rem",
              height: "2.5rem",
              backgroundColor: "#DA7F67",
              zIndex: -1,
            },

            /* ----------------------
             * 기본 날짜 스타일
             * ---------------------- */
            ".MuiPickersDay-root": {
              width: "4.5rem !important",
              height: "2.5rem !important",
              lineHeight: "normal",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
              "&:disabled": {
                color: "#B3B3B3",
              },

              ...(isChinese
                ? {
                    ":last-child": {
                      color: "#F40000",
                      "&:disabled": { color: "#FFACAC" },
                    },
                  }
                : {
                    ":first-of-type": {
                      color: "#F40000",
                      "&:disabled": { color: "#FFACAC" },
                    },
                  }),
            },

            /* 요일 색상 */
            ".MuiDayCalendar-weekDayLabel": {
              color: "black",
              ...(isChinese
                ? { ":last-child": { color: "#F40000" } }
                : { ":first-of-type": { color: "#F40000" } }),
            },

            ".MuiPickersSlideTransition-root": {
              minHeight: "21rem",
            },
            /* -------------------------
             * 500px 이하 (모바일)
             * 선택 네모 + 날짜 셀 크기 축소
             * ------------------------- */
            "@media (max-width: 500px)": {
              ".MuiPickersDay-root": {
                width: "2rem !important",
                height: "2rem !important",
              },
              ".MuiPickersDay-root.Mui-selected::before": {
                width: "2rem",
                height: "2rem",
              },
            },
          }}
          minDate={dayjs().startOf("day")}
          disablePast
          disableHighlightToday
          shouldDisableDate={(date: Dayjs) =>
            disabledDates.some((d) => dayjs(d).isSame(date, "day"))
          }
          {...props}
        />
      </LocalizationProvider>

      {footer && <div tw="border-t border-[#ddd]">{footer}</div>}
    </div>
  )
}

export default Calendar
