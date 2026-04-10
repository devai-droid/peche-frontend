import { useEffect, useState, useRef } from "react"

const PECHE_LOCATION = { lat: 37.49556, lng: 127.0294 }

export interface GoogleReview {
  author_name: string
  rating: number
  text: string
  relative_time_description: string
  profile_photo_url: string
  language: string
  time: number
}

const useGoogleReviews = (maxReviews = 5) => {
  const [reviews, setReviews] = useState<GoogleReview[]>([])
  const [placeRating, setPlaceRating] = useState<number>(0)
  const [totalReviews, setTotalReviews] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const mapRef = useRef<HTMLDivElement | null>(null)
  const attempted = useRef(false)

  useEffect(() => {
    if (attempted.current) return
    attempted.current = true

    const tryFetch = () => {
      // google.maps.places가 로드될 때까지 대기
      if (
        typeof google === "undefined" ||
        !google.maps ||
        !google.maps.places
      ) {
        setTimeout(tryFetch, 1000)
        return
      }

      if (!mapRef.current) {
        mapRef.current = document.createElement("div")
      }

      const map = new google.maps.Map(mapRef.current, {
        center: PECHE_LOCATION,
        zoom: 17,
      })

      const service = new google.maps.places.PlacesService(map)

      service.nearbySearch(
        {
          location: PECHE_LOCATION,
          radius: 100,
          keyword: "peche clinic",
        },
        (results, status) => {
          if (
            status === google.maps.places.PlacesServiceStatus.OK &&
            results &&
            results.length > 0
          ) {
            const placeId = results[0].place_id
            if (!placeId) {
              setLoading(false)
              return
            }

            service.getDetails(
              {
                placeId,
                fields: ["reviews", "rating", "user_ratings_total"],
              },
              (place, detailStatus) => {
                if (
                  detailStatus ===
                    google.maps.places.PlacesServiceStatus.OK &&
                  place
                ) {
                  setPlaceRating(place.rating || 0)
                  setTotalReviews(place.user_ratings_total || 0)
                  const sortedReviews = (place.reviews || [])
                    .sort((a, b) => (b.time || 0) - (a.time || 0))
                    .slice(0, maxReviews) as GoogleReview[]
                  setReviews(sortedReviews)
                }
                setLoading(false)
              },
            )
          } else {
            setLoading(false)
          }
        },
      )
    }

    tryFetch()
  }, [maxReviews])

  return { reviews, placeRating, totalReviews, loading }
}

export default useGoogleReviews
