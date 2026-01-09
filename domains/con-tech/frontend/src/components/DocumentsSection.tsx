import DocumentItem from './DocumentItem';
import { FaUpload } from 'react-icons/fa';
import type { Document } from './type';

interface Props {
  documents: Document[];
}

function DocumentsSection({ documents }: Props) {
  return (
    <div className="mt-8">
      <div className="flex justify-between mb-2">
        <h3 className="font-bold">Recent Documents and Media</h3>
        <FaUpload className="text-yellow-500 cursor-pointer" />
      </div>
      {documents.map((doc, index) => (
        <DocumentItem key={index} document={doc} />
      ))}
    </div>
  );
}

export default DocumentsSection;
