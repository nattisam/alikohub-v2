import React, { useState, useRef, useEffect } from "react";
import { FaX } from "react-icons/fa6";
import type { FileWithMetadata } from "./types";

interface FileUploadModalProps {
  onClose: () => void;
  onContinue: (files: FileWithMetadata[]) => void;
  maxFiles?: number
}

const FileUploadModal: React.FC<FileUploadModalProps> = ({
  onClose,
  onContinue,
  maxFiles = 10
}) => {
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Define allowed file types and extensions
  const allowedTypes: string[] = [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/png",
    "image/webp",
    "image/jpeg",
    "image/jpg",
    "text/csv",
    "text/plain",
    "application/zip",
  ];
  const allowedExtensions: string[] = [
    ".docx",
    ".png",
    ".webp",
    ".csv",
    ".txt",
    ".zip",
    ".jpg",
    ".jpeg"
  ];
  const imageExtensions: string[] = [".png", ".jpg", ".jpeg", ".webp"]; // For preview generation
  const maxSize: number = 10 * 1024 * 1024; // 10MB

  // Generate preview for image files
  const generatePreview = (file: File): Promise<FileWithMetadata> => {
    return new Promise((resolve) => {
      if (
        imageExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
      ) {
        const preview = URL.createObjectURL(file);
        resolve({
          ...{
            file: file,
            webkitRelativePath: file.webkitRelativePath,
          },
          preview,
        });
      } else {
        resolve({
          ...{
            file: file,
            webkitRelativePath: file.webkitRelativePath,
          },
        });
      }
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (
    e: React.DragEvent<HTMLDivElement>
  ): Promise<void> => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles: File[] = Array.from(e.dataTransfer.files);
    await processFiles(droppedFiles);
  };

  const handleFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    e.stopPropagation();
    const selectedFiles: File[] = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) await processFiles(selectedFiles);
    if (files.length > maxFiles) {
      setError(`Please remove extra files (max ${maxFiles} allowed).`);
      return;
    }
  };

  const processFiles = async (newFiles: File[]): Promise<void> => {
    setError("");
    const processedFiles: FileWithMetadata[] = await Promise.all(
      newFiles.map(generatePreview)
    );
    const validFiles: FileWithMetadata[] = processedFiles.filter(
      (file: FileWithMetadata) => {
        const isValidType: boolean =
          allowedTypes.includes(file.file.type) ||
          allowedExtensions.some((ext) => {
            return file.file.name.toLowerCase().endsWith(ext);
          });
        if (!isValidType) {
          setError(
            `Invalid file type. Supported: ${allowedExtensions.join(", ")}`
          );
          return false;
        }
        if (file.file.size > maxSize) {
          setError("File too large. Maximum size: 10MB");
          return false;
        }
        return true;
      }
    );
    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleBrowseClick = (): void => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleContinue = (e: React.ChangeEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (files.length > 0 && onContinue) {
      try {
        setIsUploading(true)
        setError("")
        onContinue(files);
        onClose();
        alert("Files uploaded successfully!")
      } catch (err) {
        setError("Error uploading files. Try again please!")
        console.error(err);
      } finally {
        setIsUploading(false)
      }
    }
  };

  // Cleanup previews when component unmounts
  useEffect(() => {
    return () => {
      files.forEach(
        (file) => file.preview && URL.revokeObjectURL(file.preview)
      );
    };
  }, [files]);

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-300/70 bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-2 text-gray-600 hover:text-black"
        >
          <FaX className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-bold mb-2">Upload file</h2>
        <p className="text-sm text-gray-500 mb-4">
          Add your files or documents here
        </p>
        <form onSubmit={handleContinue}>
          <div
            className={`border-2 border-dashed ${isDragging ? "border-blue-500 bg-blue-50" : "border-yellow-400"
              } rounded-lg p-8 text-center cursor-pointer transition-colors`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleBrowseClick}
          >
            <div className="text-gray-400 mb-2">📄</div>
            <p className="text-yellow-600">
              Drop your files here, or click to browse
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className=""
              accept=".docx,.png,.webp,.csv,.txt,.zip"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          {files.length > 0 && (
            <ul className="mt-4 text-sm">
              {files.map((file, index) => (
                <li key={index} className="flex items-center space-x-2">
                  {file.preview ? (
                    <img
                      src={file.preview}
                      alt={file.file.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400">📄</span>
                  )}
                  <span>{file.file.name}</span>
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm text-gray-500 mt-4">
            Supported files: .docx, .png, .webp, .csv, .txt, .zip Maximum size:
            10MB
          </p>
          <button
            type="submit"
            className="w-full bg-yellow-400 text-black py-3 rounded-lg mt-6 hover:bg-yellow-300 transition disabled:opacity-50"
            disabled={files.length === 0}
          >
            Continue
          </button>
        </form>
      </div>
      {isUploading && (<div className="w-full inset-0 z-20 flex items-center justify-center">
        <div className="w-32 h-32 animate-spin" />
      </div>)}
    </div>
  );
};

export default FileUploadModal;
