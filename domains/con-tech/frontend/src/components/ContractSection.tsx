import { useState } from "react";
import type { Contract } from "./type";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { ContractCard } from "./ContractCard";

interface ContractSectionProps {
  projectName: string;
  contracts: Contract[];
}

const ContractSection: React.FC<ContractSectionProps> = ({ projectName, contracts }) => {
  const [unfolded, setUnfolded] = useState<boolean>(false);

  return (
    <div className="w-full rounded my-2">
      <div className="flex justify-between items-center p-2 bg-gray-100 rounded">
        <p>Contracts for project {projectName}</p>
        <span>
          <button 
            onClick={() => setUnfolded(!unfolded)} 
            className="font-bold text-xl"
          >
            {!unfolded ? <FaArrowDown /> : <FaArrowUp />}
          </button>
        </span>
      </div>
      {
        unfolded && contracts.map((contract: Contract) => (
          <div key={contract.id} className="p-2">
            <ContractCard contract={contract} />
          </div>
        ))
      }
    </div>
  );
};

export default ContractSection;