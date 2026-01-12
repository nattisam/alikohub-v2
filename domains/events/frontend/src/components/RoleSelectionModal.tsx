import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface RoleSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleSelected: (role: 'USER' | 'ORGANIZER') => void;
}

const RoleSelectionModal: React.FC<RoleSelectionModalProps> = ({ isOpen, onClose, onRoleSelected }) => {
  const { selectRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'USER' | 'ORGANIZER' | null>(null);
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (role: 'USER' | 'ORGANIZER') => {
    setSelectedRole(role);
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    
    try {
      setLoading(true);
      await selectRole(selectedRole);
      onRoleSelected(selectedRole);
      onClose();
    } catch (error) {
      console.error('Error selecting role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Select Your Role</h2>
        <p className="text-gray-300 mb-6">Choose how you want to participate in our platform</p>
        
        <div className="space-y-4">
          <button
            onClick={() => handleRoleSelect('USER')}
            className={`w-full text-left p-4 rounded-lg border-2 transition ${
              selectedRole === 'USER'
                ? 'border-indigo-500 bg-indigo-900 bg-opacity-30'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                selectedRole === 'USER' ? 'border-indigo-500' : 'border-gray-400'
              }`}>
                {selectedRole === 'USER' && (
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">Participant</h3>
                <p className="text-sm text-gray-400">Join events, view schedules, and participate in activities</p>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => handleRoleSelect('ORGANIZER')}
            className={`w-full text-left p-4 rounded-lg border-2 transition ${
              selectedRole === 'ORGANIZER'
                ? 'border-indigo-500 bg-indigo-900 bg-opacity-30'
                : 'border-gray-600 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center">
              <div className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                selectedRole === 'ORGANIZER' ? 'border-indigo-500' : 'border-gray-400'
              }`}>
                {selectedRole === 'ORGANIZER' && (
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                )}
              </div>
              <div>
                <h3 className="font-medium text-white">Event Organizer</h3>
                <p className="text-sm text-gray-400">Create and manage events, invite participants</p>
              </div>
            </div>
          </button>
        </div>
        
        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-300 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedRole || loading}
            className={`px-4 py-2 rounded-md transition ${
              selectedRole && !loading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                : 'bg-gray-600 text-gray-400 cursor-not-allowed'
            }`}
          >
            {loading ? 'Saving...' : 'Confirm Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionModal;