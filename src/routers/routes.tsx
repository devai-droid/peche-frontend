import { createBrowserRouter, Navigate, Outlet, ScrollRestoration } from "react-router-dom"
import Home from "@/pages/home/home.page"
import Intro from "@/pages/intro/intro.page"
import IntroHospital from "@/pages/intro/tabs/intro-hospital.tab"
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
import BlogDetail from "@/pages/blog/blog-detail.page"
import BlogWrite from "@/pages/blog/blog-write.page"
import Signup from "@/pages/signup/signup.page"
import SignupComplete from "@/pages/signup/signup-complete.page"
import AdminLogin from "@/pages/admin/admin-login.page"
import AdminCategories from "@/pages/admin/admin-categories.page"
import DoctorPage from "@/pages/doctor/doctor.page"
import WhyPechePage from "@/pages/why-peche/why-peche.page"

const router = createBrowserRouter([
  {
    path: "/favicon.ico",
    element: null, // Let the server handle favicon
  },
  {
    path: "/sitemap.xml",
    element: null, // Let the server handle this route
  },
  {
    path: "/",
    element: (() => {
      const browserLang = (navigator.language || "ko").toLowerCase()
      let lang = "ko"
      if (browserLang.startsWith("en")) lang = "en"
      else if (browserLang.startsWith("zh-tw") || browserLang.startsWith("zh-hant")) lang = "tw"
      else if (browserLang.startsWith("zh")) lang = "zh"
      else if (browserLang.startsWith("ja")) lang = "ja"
      else if (browserLang.startsWith("th")) lang = "th"
      else if (browserLang.startsWith("ko")) lang = "ko"
      return (
        <Navigate
          replace
          to={{
            pathname: `/${lang}`,
            search: window.location.search,
          }}
        />
      )
    })(),
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
          // { path: "worker", element: <IntroWorker /> },
          // { path: "machine", element: <IntroMachine /> },
          // { path: "way", element: <IntroMap /> },
        ],
      },
      { path: "doctor", element: <DoctorPage /> },
      { path: "why-peche", element: <WhyPechePage /> },
      { path: "blog", element: <Blog /> },
      { path: "blog/write", element: <BlogWrite /> },
      { path: "blog/edit/:slug", element: <BlogWrite /> },
      { path: "blog/:slug", element: <BlogDetail /> },
      { path: "admin/login", element: <AdminLogin /> },
      { path: "admin/categories", element: <AdminCategories /> },
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
