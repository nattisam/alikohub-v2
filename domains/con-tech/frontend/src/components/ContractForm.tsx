import React, { useState } from 'react';
import { type AddChangeOrderDto } from '../components/types';
import { useUploadContract, useUpdateContractStatus } from '../queries/contracts';
import FileUploadModal from './FileUploadForm';

interface ContractFormProps {
    projectId: number;
    onSubmit: (projectId: number, file: File) => void;
}

export const ContractForm: React.FC<ContractFormProps> = ({
    projectId,
    onSubmit,
}) => {
    return (
        <div
            className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-4"
        >
            <h2 className="text-lg font-semibold text-gray-900">
                {'Upload Contract'}
            </h2>

            <FileUploadModal onClose={() => { }} onContinue={(files) => {
                for (const file of files) {
                    onSubmit(projectId, file.file)
                }
            }} />
        </div>
    );
};

export const AddChangeOrders: React.FC<{ contractid: number }> = ({ contractid }) => {
    const uploadContractMutation = useUploadContract();
    const updateContractStatusMutation = useUpdateContractStatus();
    const [newChangeOrder, setNewChangeOrder] = useState<AddChangeOrderDto>({
        description: "",
        amount: 0
    });
    const [changingOrder, setChangingOrder] = useState<{ loading: boolean; error: string | null }>({
        loading: false, error: null
    });
    const handleChangeOrderChange = (
        field: keyof AddChangeOrderDto,
        value: string
    ) => {
        setNewChangeOrder({ ...newChangeOrder, [field]: value })
    };
    const handleAddChangeOrder = async () => {
        try {
            setChangingOrder({ loading: true, error: null })
            // This functionality would need to be implemented in the API and hooks
            // updateContractStatusMutation.mutate({ id: contractid, status: newChangeOrder });
        } catch (err) {
            setChangingOrder({ ...changingOrder, error: "Error while adding change orders! Try again later." })
        } finally {
            setChangingOrder({ ...changingOrder, loading: false })
        }
    }
    return (
        <form>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Change Orders
            </label>
            <div className="space-y-3">
                <div
                    className="border border-gray-200 rounded-md p-3 space-y-2 bg-gray-50"
                >
                    <div className="flex gap-2">
                        <textarea
                            placeholder="Description for your order change here..."
                            value={newChangeOrder.description ?? ""}
                            onChange={(e) =>
                                handleChangeOrderChange('description', e.target.value)
                            }
                            className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <input
                            type="number"
                            placeholder="Amount"
                            value={newChangeOrder.amount ?? 0}
                            onChange={(e) =>
                                handleChangeOrderChange('amount', e.target.value)
                            }
                            className="w-32 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>
            <button
                type="button"
                onClick={handleAddChangeOrder}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
                + Add Change Order
            </button>
        </form>)
}