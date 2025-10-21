"use client";

import {
  Box,
  Button,
  Flex,
  IconButton,
  Spinner,
  Text,
  useColorModeValue,
  HStack,
  Tooltip,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import {
  FiAlertCircle,
  FiZoomIn,
  FiZoomOut,
  FiDownload,
  FiRotateCw,
  FiMaximize2,
} from "react-icons/fi";

interface PDFViewerProps {
  fileUrl: string;
}

export const PDFViewer = ({ fileUrl }: PDFViewerProps) => {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const toolbarBg = useColorModeValue("gray.50", "gray.900");

  useEffect(() => {
    if (!fileUrl) {
      setError("URL do arquivo não fornecida");
      setIsLoading(false);
      return;
    }

    // Verifica se é uma URL válida
    try {
      new URL(fileUrl);
      setPdfUrl(fileUrl);
      setIsLoading(false);
    } catch (err) {
      setError("URL do arquivo inválida");
      setIsLoading(false);
    }
  }, [fileUrl]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5));
  };

  const handleDownload = () => {
    window.open(pdfUrl, "_blank");
  };

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      }
    }
  };

  if (error) {
    return (
      <Flex
        w="full"
        minH="400px"
        justify="center"
        align="center"
        direction="column"
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        p={8}
        gap={4}
      >
        <Box color="red.500" fontSize="3xl">
          <FiAlertCircle />
        </Box>
        <Text fontSize="md" color="gray.600" _dark={{ color: "gray.400" }}>
          {error}
        </Text>
        <Button
          size="sm"
          onClick={() => window.location.reload()}
          colorScheme="blue"
        >
          Recarregar Página
        </Button>
      </Flex>
    );
  }

  if (isLoading) {
    return (
      <Flex
        w="full"
        minH="400px"
        justify="center"
        align="center"
        direction="column"
        bg={bgColor}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={borderColor}
        gap={4}
      >
        <Spinner size="xl" color="#00713D" thickness="4px" />
        <Text fontSize="sm" color="gray.600" _dark={{ color: "gray.400" }}>
          Carregando documento...
        </Text>
      </Flex>
    );
  }

  return (
    <Box
      w="full"
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      overflow="hidden"
    >
      {/* Toolbar customizada */}
      <Flex
        px={4}
        py={2}
        bg={toolbarBg}
        borderBottomWidth="1px"
        borderBottomColor={borderColor}
        justify="space-between"
        align="center"
        gap={2}
        flexWrap="wrap"
      >
        <HStack spacing={2}>
          <Tooltip label="Diminuir zoom">
            <IconButton
              aria-label="Zoom out"
              icon={<FiZoomOut />}
              size="sm"
              variant="ghost"
              onClick={handleZoomOut}
              isDisabled={scale <= 0.5}
            />
          </Tooltip>
          <Text fontSize="sm" minW="60px" textAlign="center">
            {Math.round(scale * 100)}%
          </Text>
          <Tooltip label="Aumentar zoom">
            <IconButton
              aria-label="Zoom in"
              icon={<FiZoomIn />}
              size="sm"
              variant="ghost"
              onClick={handleZoomIn}
              isDisabled={scale >= 3}
            />
          </Tooltip>
        </HStack>
        <HStack spacing={2}>
          <Tooltip label="Tela cheia">
            <IconButton
              aria-label="Fullscreen"
              icon={<FiMaximize2 />}
              size="sm"
              variant="ghost"
              onClick={handleFullscreen}
            />
          </Tooltip>
          <Tooltip label="Baixar PDF">
            <IconButton
              aria-label="Download"
              icon={<FiDownload />}
              size="sm"
              variant="ghost"
              onClick={handleDownload}
            />
          </Tooltip>
        </HStack>
      </Flex>

      {/* PDF Viewer */}
      <Box
        position="relative"
        overflow="auto"
        minH={{ base: "500px", md: "600px", lg: "700px" }}
        maxH="800px"
      >
        <Box
          ref={iframeRef}
          as="iframe"
          title="Pré-visualização do PDF"
          src={pdfUrl}
          width="100%"
          height="100%"
          minH={{ base: "500px", md: "600px", lg: "700px" }}
          border="none"
          transform={`scale(${scale})`}
          transformOrigin="top center"
          transition="transform 0.3s ease"
        />
      </Box>
    </Box>
  );
};
