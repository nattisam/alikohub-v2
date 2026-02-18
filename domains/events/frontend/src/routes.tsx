import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { EventsLayout } from "./components/layout/EventsLayout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import PostDetailPage from "./pages/PostDetailPage";
import NewsPage from "./pages/NewsPage";
import PromotionRequestPage from "./pages/PromotionRequestPage";
import LoginPage from "./pages/LoginPage";
import ContentManagerDashboard from "./pages/content-manager/ContentManagerDashboard";
import CreatePostPage from "./pages/content-manager/CreatePostPage";
import EditPostPage from "./pages/content-manager/EditPostPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReviewPage from "./pages/admin/AdminReviewPage";
import ContentManagersManagementPage from "./pages/admin/ContentManagersManagementPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <EventsLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "events", element: <EventsPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "post/:id", element: <PostDetailPage /> },
      { path: "promotion-request", element: <PromotionRequestPage /> },
      {
        path: "content-manager",
        element: (
          <RequireAuth roles={["CONTENT_MANAGER"]}>
            <ContentManagerDashboard />
          </RequireAuth>
        ),
      },
      {
        path: "content-manager/create",
        element: (
          <RequireAuth roles={["CONTENT_MANAGER"]}>
            <CreatePostPage />
          </RequireAuth>
        ),
      },
      {
        path: "content-manager/edit/:id",
        element: (
          <RequireAuth roles={["CONTENT_MANAGER"]}>
            <EditPostPage />
          </RequireAuth>
        ),
      },
      {
        path: "admin",
        element: (
          <RequireAuth roles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        ),
      },
      {
        path: "admin/review/:id",
        element: (
          <RequireAuth roles={["ADMIN"]}>
            <AdminReviewPage />
          </RequireAuth>
        ),
      },
      {
        path: "admin/users",
        element: (
          <RequireAuth roles={["ADMIN"]}>
            <ContentManagersManagementPage />
          </RequireAuth>
        ),
      },
    ],
  },
]);
