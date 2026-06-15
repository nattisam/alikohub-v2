import React, { useEffect } from "react";
import { Viewer, Worker, type PageChangeEvent } from "@react-pdf-viewer/core";
import { pageNavigationPlugin } from "@react-pdf-viewer/page-navigation";
import { zoomPlugin } from "@react-pdf-viewer/zoom";
import { fullScreenPlugin } from "@react-pdf-viewer/full-screen";
import { thumbnailPlugin } from "@react-pdf-viewer/thumbnail";
import { searchPlugin } from "@react-pdf-viewer/search";

// Import styles
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/page-navigation/lib/styles/index.css";
import "@react-pdf-viewer/zoom/lib/styles/index.css";
import "@react-pdf-viewer/full-screen/lib/styles/index.css";
import "@react-pdf-viewer/thumbnail/lib/styles/index.css";
import "@react-pdf-viewer/search/lib/styles/index.css";

interface InlinePdfViewerProps {
  fileUrl: string;
  onPageChange?: (pageIndex: number, totalPages: number) => void;
  onDocumentLoad?: (totalPages: number) => void;
}

const InlinePdfViewer: React.FC<InlinePdfViewerProps> = ({
  fileUrl,
  onPageChange,
  onDocumentLoad,
}) => {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const zoomPluginInstance = zoomPlugin();
  const fullScreenPluginInstance = fullScreenPlugin();
  const thumbnailPluginInstance = thumbnailPlugin();
  const searchPluginInstance = searchPlugin();

  const handlePageChange = (e: PageChangeEvent) => {
    if (onPageChange) {
      onPageChange(e.currentPage + 1, e.doc.numPages);
    }
  };

  const handleDocumentLoad = (e: any) => {
    if (onDocumentLoad) {
      onDocumentLoad(e.doc.numPages);
    }
  };

  return (
    <div className="flex-1 w-full h-full bg-slate-100 overflow-hidden flex flex-col">
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <div className="flex-1 overflow-hidden relative">
          <Viewer
            fileUrl={fileUrl}
            plugins={[
              pageNavigationPluginInstance,
              zoomPluginInstance,
              fullScreenPluginInstance,
              thumbnailPluginInstance,
              searchPluginInstance,
            ]}
            onPageChange={handlePageChange}
            onDocumentLoad={handleDocumentLoad}
          />
        </div>
      </Worker>
    </div>
  );
};

export default InlinePdfViewer;
