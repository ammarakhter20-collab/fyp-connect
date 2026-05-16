import React, { useEffect } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist/build/pdf';

// Must set workerSrc before any getDocument() call to avoid
// "Cannot read properties of undefined (reading 'addListener')" crash
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/4.1.392/pdf.worker.min.mjs`;

const PdfViewer = ({ pdfUrl }) => {
  useEffect(() => {
    const renderPdf = async () => {
      // Load the PDF document
      const pdf = await getDocument(pdfUrl).promise;

      // Get the first page of the PDF
      const page = await pdf.getPage(1);

      // Render the page
      const canvas = document.getElementById('pdfCanvas');
      const context = canvas.getContext('2d');
      const viewport = page.getViewport({ scale: 1 });
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport });
    };

    renderPdf();
  }, [pdfUrl]);

  return (
    <div>
      <canvas id="pdfCanvas"></canvas>
    </div>
  );
};

export default PdfViewer;
