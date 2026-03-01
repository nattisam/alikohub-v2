import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface UIContextType {
  isRoleModalOpen: boolean;
  setRoleModalOpen: (open: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isRoleModalOpen, setRoleModalOpen] = useState(false);

  return (
    <UIContext.Provider value={{ isRoleModalOpen, setRoleModalOpen }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider");
  }
  return context;
};
