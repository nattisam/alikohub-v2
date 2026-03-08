import { Navigate, useLocation } from 'react-router-dom';
import { useSSO } from '@/hooks/useSSO';
import { useUser } from '@/hooks/useAuth';

interface AccessGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
  requirePayment?: boolean;
  redirectTo?: string;
}

export const AccessGuard = ({ 
  children, 
  requiredRole, 
  requirePayment = false,
  redirectTo 
}: AccessGuardProps) => {
  const { isAuthenticated, isLoading, emailVerified } = useSSO();
  const { data: user, isLoading: userLoading } = useUser();
  const location = useLocation();

  // Show loading while checking auth state
  if (isLoading || userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading AlikoHub...</p>
        </div>
      </div>
    );
  }

  // 1. Check Authentication
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Check Email Verification
  if (!emailVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  // 3. Check Role Requirements
  if (requiredRole) {
    const userRole = user.academyRole || user.globalRole;
    if (userRole !== requiredRole && userRole !== 'ADMIN') {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  // 4. Check Payment Status (if required)
  if (requirePayment) {
    const paymentStatus = user.paymentStatus || user.academyStatus;
    
    // Redirect to payment if status is PENDING or not paid
    if (paymentStatus === 'PENDING' || !paymentStatus || paymentStatus === 'UNPAID') {
      return <Navigate to="/payment" state={{ from: location }} replace />;
    }
  }

  // Custom redirect logic
  if (redirectTo && location.pathname !== redirectTo) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

// Specialized guards for common use cases
export const StudentGuard = ({ children }: { children: React.ReactNode }) => (
  <AccessGuard requiredRole="student" requirePayment={true}>
    {children}
  </AccessGuard>
);

export const InstructorGuard = ({ children }: { children: React.ReactNode }) => (
  <AccessGuard requiredRole="instructor">
    {children}
  </AccessGuard>
);

export const AdminGuard = ({ children }: { children: React.ReactNode }) => (
  <AccessGuard requiredRole="ADMIN">
    {children}
  </AccessGuard>
);

export const VerifiedGuard = ({ children }: { children: React.ReactNode }) => (
  <AccessGuard requirePayment={false}>
    {children}
  </AccessGuard>
);
