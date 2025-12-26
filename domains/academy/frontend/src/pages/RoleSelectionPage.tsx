import React from "react";
import RoleSelectionModal from "../components/RoleSelectionModal";

const RoleSelectionPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <RoleSelectionModal />
    </div>
  );
};

export default RoleSelectionPage;