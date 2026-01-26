import { useState } from "react";
import {type  Contract, ContractStatus } from "./types";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";

const statusColors: Record<ContractStatus, string> = {
    [ContractStatus.DRAFT]: 'bg-yellow-100 text-yellow-800',
    [ContractStatus.PENDING_APPROVAL]: 'bg-blue-100 text-blue-800',
    [ContractStatus.APPROVED]: 'bg-green-100 text-green-800',
    [ContractStatus.REJECTED]: 'bg-red-100 text-red-800',
    [ContractStatus.AMENDED]: 'bg-purple-100 text-purple-800',
};

export const ContractCard: React.FC<{ contract: Contract }> = ({ contract }) => {
    const [unfolded, setUnfolded] = useState<boolean>(false);
    if (!unfolded) {
        return (
            <div className="flex flex-row items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Contract #{contract.id}
                    </h2>
                    <p className="text-sm text-gray-500">Project: {contract.projectId}</p>
                </div>
                <button onClick={() => setUnfolded(!unfolded)} className="font-bold text-xl"><FaArrowDown /></button>
            </div>
        )
    }
    return (
        <div id={`${contract.id}`} className="bg-white shadow rounded-lg p-6 border border-gray-200">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h2 className="w-full text-lg font-semibold text-gray-900">
                        Contract #{contract.id}
                        <span>
                            <button
                                onClick={() => setUnfolded(!unfolded)}
                                className="font-bold text-xl">
                                <FaArrowUp />
                            </button>
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500">Project: {contract.projectId}</p>
                </div>
                <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[contract.status]}`}
                >
                    {contract.status}
                </span>
            </div>

            {/* File Info */}
            <div className="mb-4">
                <p className="text-sm text-gray-700 font-medium">File:</p>
                <a
                    href={contract.secureUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                >
                    {contract.fileName}
                </a>
            </div>

            {/* Change Orders */}
            {contract.changeOrders?.length > 0 && (
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Change Orders:</p>
                    <ul className="space-y-1">
                        {contract.changeOrders.map((co) => (
                            <li
                                key={co.id}
                                className="text-sm bg-gray-50 border border-gray-200 rounded-md p-2"
                            >
                                <div className="flex justify-between">
                                    <span>{co.description}</span>
                                    <span className="text-gray-600">${co.amount.toFixed(2)}</span>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Created: {new Date(co.createdAt).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Metadata */}
            <div className="text-xs text-gray-400">
                <p>Created: {new Date(contract.uploadedAt).toLocaleString()}</p>
                <p>Updated: {new Date(contract.updatedAt).toLocaleString()}</p>
            </div>
        </div>
    );
};
