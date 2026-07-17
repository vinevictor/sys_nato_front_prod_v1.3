"use client";

import { useEffect, useRef, useState } from "react";
import { Box, Spinner, Center, Text, VStack } from "@chakra-ui/react";
import * as pdfjsLib from "pdfjs-dist";

// Configura o worker oficial da biblioteca (usando CDN para evitar problemas em produção)
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

interface PdfPreviewProps {
  file: File | null;
}

export default function PdfPreview({ file }: PdfPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!file) return;

    const renderPdf = async () => {
      setLoading(true);
      setError(null);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;

        const page = await pdf.getPage(1);

        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext("2d");
        if (!context) return;

        const viewport = page.getViewport({ scale: 1.5 });
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        const renderContext = {
          canvasContext: context,
          canvas: canvas,
          viewport: viewport,
        };

        await page.render(renderContext).promise;
      } catch (err) {
        console.error("Erro ao renderizar PDF em produção:", err);
        setError("Não foi possível gerar a prévia deste documento.");
      } finally {
        setLoading(false);
      }
    };

    renderPdf();
  }, [file]);

  if (loading) {
    return (
      <Center
        p={10}
        border="1px dashed"
        borderColor="gray.300"
        borderRadius="md"
      >
        <VStack>
          <Spinner size="lg" color="blue.500" />
          <Text fontSize="sm" color="gray.500">
            Renderizando prévia do documento...
          </Text>
        </VStack>
      </Center>
    );
  }

  if (error) {
    return (
      <Center
        p={6}
        bg="red.50"
        color="red.600"
        borderRadius="md"
        border="1px solid"
        borderColor="red.200"
      >
        <Text fontSize="sm">{error}</Text>
      </Center>
    );
  }

  return (
    <Box
      border="1px solid"
      borderColor="gray.200"
      borderRadius="md"
      overflow="auto"
      maxH="600px"
      bg="gray.100"
      p={2}
    >
      <Center>
        <canvas
          ref={canvasRef}
          style={{
            maxWidth: "100%",
            height: "auto",
            boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
          }}
        />
      </Center>
    </Box>
  );
}
