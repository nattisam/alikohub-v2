import { contechApi } from "../api";
import DocumentCard from "./DocumentCard";
import FileUploadModal from "./FileUploadForm";
import type { Document, FileWithMetadata } from "./types";
import { useState } from "react"; 

const RecentDocuments = ({ documents }: { documents: Document[] }) => {
  const [uploadFiles, setUploadFiles] = useState(false);
  return (
    <section className="bg-white rounded-lg shadow-md p-4 mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Recent Documents</h2>
        <button
          className="bg-yellow-400 text-black px-4 py-2 rounded hover:bg-yellow-300 transition"
          onClick={() => setUploadFiles(true)}
        >
          ↑ Upload
        </button>
        {uploadFiles && (
          <FileUploadModal
            onContinue={async(files :FileWithMetadata[]) => {
              const formData = new FormData();
              for (const file of files) {
                formData.append("contractFile", file.file);
              }
              contechApi.post("inspection/upload", formData, {
                headers:{
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                  "Content-Type": "multipart/form-data",
                  Accept: "application/json"
                }
              });
            }}
            onClose={() => setUploadFiles(false)}
          />
        )}
      </div>
      {documents.map((doc, index) => (
        <DocumentCard key={index} doc={doc} />
      ))}
    </section>
  );
};

export default RecentDocuments;
