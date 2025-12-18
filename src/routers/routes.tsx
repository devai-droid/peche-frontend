import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from "react-router-dom"
import Home from "@/pages/home/home.page"
import Intro from "@/pages/intro/intro.page"
import IntroHospital from "@/pages/intro/tabs/intro-hospital.tab"
import IntroDoctor from "@/pages/intro/tabs/intro-doctor.tab"
import IntroWorker from "@/pages/intro/tabs/intro-worker.tab"
import IntroMachine from "@/pages/intro/tabs/intro-machine.tab"
import IntroMap from "@/pages/intro/tabs/intro-map.tab"
import AllTreatmentPage from "@/pages/treatment/all-treatment.page"
import Products from "@/pages/product/products.page"
import ProductDetail from "@/pages/product/product-detail.page"
import Events from "@/pages/product/events.page"
import Reserve from "@/pages/reservation/reserve.page"
import Reservations from "@/pages/reservation/reservation.page"
import ReservationComplete from "@/pages/reservation/reservation-complete.page"
import KakaoRedirectedOauthPage from "@/pages/auth/kakao-redirected-oauth/kakao-redirected-oauth.page"
import TermsOfService from "@/pages/terms/term-of-service.page"
import PrivacyPolicy from "@/pages/terms/privacy-policy.page"
import Blog from "@/pages/blog/blog.page"
import Signup from "@/pages/signup/signup.page"
import SignupComplete from "@/pages/signup/signup-complete.page"

const router = createBrowserRouter([
  {
    path: "/sitemap.xml",
    element: null, // Let the server handle this route
  },
  {
    path: "/favicon.ico",
    element: null, // Let the server handle favicon
  },

  {
    path: "/",
    element: (
      <Navigate
        replace
        to={{
          pathname: "/ko",
          search: window.location.search,
        }}
      />
    ),
  },
  {
    path: "/auth/kakao/redirect",
    element: <KakaoRedirectedOauthPage />,
  },
  {
    path: "/:lang",
    element: (
      <>
        <ScrollRestoration />
        <Outlet />
      </>
    ),
    children: [
      { path: "", element: <Home /> },

      { path: "treatment", element: <AllTreatmentPage /> },

      { path: "products", element: <Products /> },
      { path: "products/:id", element: <ProductDetail /> },

      { path: "events", element: <Events /> },
      { path: "events/:id", element: <ProductDetail /> },

      { path: "reservation", element: <Reservations /> },
      { path: "reservation/new", element: <Reserve /> },
      { path: "reservation/complete", element: <ReservationComplete /> },
      {
        path: "intro",
        element: <Intro />,
        children: [
          { path: "", element: <IntroHospital /> },
          // { path: "doctor", element: <IntroDoctor /> },
          { path: "worker", element: <IntroWorker /> },
          { path: "machine", element: <IntroMachine /> },
          { path: "way", element: <IntroMap /> },
        ],
      },
      { path: "blog", element: <Blog /> },
      { path: "termsofservice", element: <TermsOfService /> },
      { path: "privacypolicy", element: <PrivacyPolicy /> },
      { path: "signup", element: <Signup /> },
      { path: "signup/complete", element: <SignupComplete /> },
      {
        path: "*",
        element: (
          <Navigate
            replace
            to={{
              pathname: "/ko",
              search: window.location.search,
            }}
          />
        ),
      },
    ],
  },
])

export default router
