import { useAuth } from "../contexts/AuthContext";
import type { UserContextType } from "../components/types";

const useUser = (): UserContextType => {
  const auth = useAuth();
  
  // Return auth context values in a format similar to the old UserContext
  return {
    currentUser: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    login: auth.login,
    signup: auth.signup,
    logout: auth.logout,
    updateUser: auth.updateUser,
    refreshProfile: auth.refreshProfile,
    selectRole: auth.selectRole,
  };
};

export default useUser;