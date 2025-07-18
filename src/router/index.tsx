import { createBrowserRouter, Outlet } from "react-router-dom";
import { APP_ROUTE } from "../helpers/constants/route.constant";
import MainLayout from "../layouts/MainLayout";
import PrivateRoute from "../layouts/PrivateRoute";
import PublicRoute from "../layouts/PublicRoute";
import AppLayout from "../MyApp";
import ExplorePage from "../pages/private/ExplorePage/ExplorePage";
import SearchPostPage from "../pages/private/ExplorePage/SearchPostPage";
import Home from "../pages/private/Home/Home";
import HomePage from "../pages/private/HomePage/HomePage";
import MessagesPage from "../pages/private/MessagePage/MessagesPage";
import ProfilePage from "../pages/private/ProfilePage/ProfilePage";
import VideoCall from "../pages/private/VideoCall/VideoCall";
import GoogleCallbackPage from "../pages/public/GoogleCallbackPage";
import InvitationPage from "../pages/public/InvitationPage";
import LoginPage from "../pages/public/LoginPage";
import SignUpPage from "../pages/public/SignUpPage";

export const router = createBrowserRouter([
  {
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          {
            // index: true,
            path: APP_ROUTE.MAIN.HOME,
            element: <HomePage />,
          },
          {
            path: APP_ROUTE.MAIN.EXPLORE,
            element: <ExplorePage />,
          },
          {
            path: APP_ROUTE.MAIN.MESSAGES,
            element: (
              <MessagesPage
                conversationId={""}
                chatter={[]}
                lastChatterActiveTime={0}
                connection={null}
              />
            ),
          },
          {
            path: APP_ROUTE.MAIN.PROFILE(":id"),
            element: <ProfilePage />,
          },
          {
            path: APP_ROUTE.MAIN.SEARCH_POST,
            element: <SearchPostPage />,
          },
          {
            path: "/group-chat",
            element: <AppLayout />,
          },
          {
            path: "/invitation/:invitationCode",
            element: <InvitationPage />,
          },
          {
            path: "/group/:groupId",
            element: <MessagesPage />,
          },
        ],
      },
      {
        path: APP_ROUTE.FULL_SCREEN.VIDEO(":conversationId"),
        element: <VideoCall />,
      },
    ],
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: "/",
        element: <Outlet />,
        children: [
          {
            index: true,
            element: <Home />,
          },
          {
            path: APP_ROUTE.AUTH.LOGIN,
            element: <LoginPage />,
          },
          {
            path: APP_ROUTE.AUTH.SIGNUP,
            element: <SignUpPage />,
          },
          {
            path: APP_ROUTE.AUTH.GOOGLE_CALLBACK,
            element: <GoogleCallbackPage />,
          },
        ],
      },
    ],
  },
]);
