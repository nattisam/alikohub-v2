import { createBrowserRouter } from "react-router-dom";
import { RequireAuth } from "./components/auth/RequireAuth";
import { EventsLayout } from "./components/layout/EventsLayout";
import AdminLayout from "./components/layout/AdminLayout";
import ContentManagerLayout from "./components/layout/ContentManagerLayout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import PostDetailPage from "./pages/PostDetailPage";
import NewsPage from "./pages/NewsPage";
import PromotionRequestPage from "./pages/PromotionRequestPage";
import LoginPage from "./pages/LoginPage";
import ContentManagerDashboard from "./pages/content-manager/ContentManagerDashboard";
import CreatePostPage from "./pages/content-manager/CreatePostPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminReviewPage from "./pages/admin/AdminReviewPage";
import ContentManagersManagementPage from "./pages/admin/ContentManagersManagementPage";
import NotFoundState from "./components/states/NotFoundState";

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
    ],
  },
  {
    path: "/content-manager",
    element: (
      <RequireAuth roles={["CONTENT_MANAGER"]}>
        <ContentManagerLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <ContentManagerDashboard /> },
      { path: "create", element: <CreatePostPage /> },
    ],
  },
  {
    path: "/admin",
    element: (
      <RequireAuth roles={["ADMIN"]}>
        <AdminLayout />
      </RequireAuth>
    ),
    children: [
      { index: true, element: <AdminDashboard /> },
      { path: "review/:id", element: <AdminReviewPage /> },
      { path: "users", element: <ContentManagersManagementPage /> },
      { path: "*", element: <NotFoundState /> },
    ],
  },
  {
    path: "*",
    element: (
      <NotFoundState
        title="Page Not Found"
        message="The page you are looking for does not exist."
      />
    ),
  },
]);
