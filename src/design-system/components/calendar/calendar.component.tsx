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
    <div tw="border border-[#ddd] rounded-lg">
      <LocalizationProvider adapterLocale={language} dateAdapter={AdapterDayjs}>
        <DateCalendar
          className="!w-full !max-h-[28rem] !h-[28rem]"
          sx={{
            ".MuiPickersCalendarHeader-root": {
              marginTop: "1rem",
              marginBottom: "1rem",
              maxHeight: "1.875rem",
              minHeight: "1.875rem",
              justifyContent: "center",
              position: "relative",
            },
            ".MuiPickersCalendarHeader-labelContainer": {
              fontFamily: "Nanum Gothic",
              fontSize: "1.125rem",
              fontWeight: 800,
              marginRight: "0",
            },
            ".MuiPickersCalendarHeader-switchViewButton": {
              display: "none",
            },
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
              position: "absolute",
              left: "1rem",
              right: "1rem",
              display: "flex",
              justifyContent: "space-between",
            },
            ".MuiPickersDay-root, .MuiDayCalendar-weekDayLabel": {
              fontFamily: "Nanum Gothic",
              fontWeight: 800,
              fontSize: "1rem",
              width: "2.25rem",
              height: "2.25rem",

              "&.Mui-selected": {
                color: "white !important",
                fontWeight: 800,
                backgroundColor: "#CAB69E !important",
                "&:hover": {
                  // backgroundColor: "#CAB69E ",
                },
              },
            },
            ".MuiPickersDay-root": {
              color: "black",
              "&:disabled": {
                color: "#B3B3B3",
              },
              ...(isChinese
                ? {
                    ":nth-child(6)": {
                      color: "#327BFF",
                      "&:disabled": {
                        color: "#b2cdff",
                      },
                    },
                    ":last-child": {
                      color: "#F40000",
                      "&:disabled": {
                        color: "#FFACAC",
                      },
                    },
                  }
                : {
                    ":first-of-type": {
                      color: "#F40000",
                      "&:disabled": {
                        color: "#FFACAC",
                      },
                    },
                    ":last-child": {
                      color: "#327BFF",
                      "&:disabled": {
                        color: "#b2cdff",
                      },
                    },
                  }),
            },
            ".MuiDayCalendar-weekDayLabel": {
              color: "black",
              ...(isChinese
                ? {
                    ":nth-child(6)": {
                      color: "#327BFF",
                    },
                    ":last-child": {
                      color: "#F40000",
                    },
                  }
                : {
                    ":first-of-type": {
                      color: "#F40000",
                    },
                    ":last-child": {
                      color: "#327BFF",
                    },
                  }),
            },
            ".MuiPickersSlideTransition-root": {
              minHeight: "21rem",
            },
          }}
          // maxDate={dayjs(Date.now()).add(1, "month").endOf("month")}
          minDate={dayjs().startOf("day")}
          disablePast
          disableHighlightToday
          shouldDisableDate={(date: Dayjs) =>
            disabledDates.some((dateFromProp) => dayjs(dateFromProp).isSame(date, "day"))
          }
          {...props}
        />
      </LocalizationProvider>
      {footer && <div tw="border-t border-[#ddd]">{footer}</div>}
    </div>
  )
}

export default Calendar
