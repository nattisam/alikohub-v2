import {
  useRouteError,
  isRouteErrorResponse,
  useNavigate,
} from "react-router-dom";
import { FaExclamationTriangle, FaHome, FaRedo } from "react-icons/fa";

/**
 * Route-level error boundary for createBrowserRouter.
 * Catches errors thrown in route loaders, actions, or rendering.
 */
export default function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let title = "Something went wrong";
  let message = "An unexpected error occurred. Please try again.";
  let statusCode: number | null = null;

  if (isRouteErrorResponse(error)) {
    statusCode = error.status;
    switch (error.status) {
      case 404:
        title = "Page Not Found";
        message =
          "The page you are looking for does not exist or has been moved.";
        break;
      case 403:
        title = "Access Denied";
        message = "You do not have permission to access this page.";
        break;
      case 500:
        title = "Server Error";
        message =
          "We're having trouble processing your request. Please try again in a moment.";
        break;
      default:
        title = `Error ${error.status}`;
        message = error.statusText || "An unexpected error occurred.";
    }
  } else if (error instanceof Error) {
    message = error.message;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
            <FaExclamationTriangle className="text-red-500 text-4xl" />
          </div>
        </div>

        {statusCode && (
          <p className="text-6xl font-black text-gray-200 mb-2">{statusCode}</p>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{title}</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">{message}</p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95 shadow-lg shadow-blue-600/20"
          >
            <FaRedo /> Try Again
          </button>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-xl transition-all active:scale-95"
          >
            <FaHome /> Go Home
          </button>
        </div>

        <p className="mt-6 text-sm text-gray-400">
          If the problem persists,{" "}
          <a href="/contact" className="text-blue-600 hover:underline">
            contact support
          </a>
          .
        </p>
      </div>
    </div>
  );
}
