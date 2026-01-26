import { createBrowserRouter } from 'react-router-dom';
import { RequireAuth } from './components/auth/RequireAuth';
import { EventsLayout } from './components/layout/EventsLayout';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import PostDetailPage from './pages/PostDetailPage';
import NewsPage from './pages/NewsPage';
import PromotionRequestPage from './pages/PromotionRequestPage';
import LoginPage from './pages/LoginPage';
import ContentManagerDashboard from './pages/content-manager/ContentManagerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

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
        path: "admin",
        element: (
          <RequireAuth roles={["ADMIN"]}>
            <AdminDashboard />
          </RequireAuth>
        ),
      },
    ]
  }
]);