import { FaDownload } from 'react-icons/fa';
import type { Document } from './type';

interface Props {
  document: Document;
}

function DocumentItem({ document }: Props) {
  return (
    <div className="bg-white p-2 rounded shadow mb-2 flex justify-between items-center">
      <div>
        <h5 className="font-semibold">{document.name}</h5>
        <p className="text-sm text-gray-600">{document.updated}</p>
      </div>
      <FaDownload className="text-gray-500 cursor-pointer" />
    </div>
  );
}

export default DocumentItem;