"use client";

import VideoComponent from "@/components/video";
import { CloseIcon } from "@chakra-ui/icons";
import {
  Box,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Video {
  id: number;
  url: string;
  nome: string;
  tag: string;
  createAt: string;
  posterUrl?: string; // URL opcional para a imagem de pré-visualização
}

export default function SuporteFaqPerguntasFrequentes() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videos, setVideoList] = useState<Video[] | null>(null);
  // Estado para armazenar as URLs dos vídeos via proxy
  const [proxyUrls, setProxyUrls] = useState<Record<string, string>>({});
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/faq");
        const data = await res.json();
        setVideoList(data.video);

        if (data.video.length > 0) {
          // Criar URLs de proxy para cada vídeo
          const proxies: Record<string, string> = {};
          data.video.forEach((video: Video) => {
            proxies[video.url] = `/api/video-proxy?url=${encodeURIComponent(
              video.url
            )}`;
          });
          setProxyUrls(proxies);
        }
      } catch (error: any) {
        console.error("Erro ao buscar vídeos:", error);
        toast({
          title: "Erro ao buscar vídeos",
          description: error.message || "Erro ao buscar vídeos",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    })();
  }, []);

  const handleVideoClick = (videoUrl: string) => {
    // Usar a URL via proxy para evitar problemas de CORS
    setSelectedVideo(proxyUrls[videoUrl] || videoUrl);
    onOpen();
  };

  return (
    <Flex justify="center" align="center" flexDirection="column" p={4} mt={5}>
      <VStack spacing={8} align="center">
        <Box>
          <Text fontSize="5xl" fontWeight="bold" textAlign="center">
            Videos e Tutoriais
          </Text>
        </Box>
      </VStack>

      <Flex
        wrap="wrap"
        justify="center"
        align="center"
        gap={6}
        mt={8}
        width="100%"
        maxWidth="1200px"
      >
        {!videos && null}
        {videos &&
          videos.map((video, index) => (
            <Box
              key={index}
              as="div"
              overflow="hidden"
              width={{ base: "150px", md: "200px", lg: "250px" }}
              height={{ base: "180px", md: "220px", lg: "270px" }}
              position="relative"
              cursor="pointer"
              transition="transform 0.3s ease"
              _hover={{ transform: "scale(1.1)" }}
              onClick={() => handleVideoClick(video.url)}
            >
              <video
                src={video.url} // Mantenha a URL original para a pré-visualização
                // Adicionando poster para exibir uma imagem de pré-visualização
                poster={`https://api.microlink.io/?url=${encodeURIComponent(
                  video.url
                )}&screenshot=true&meta=false&embed=screenshot.url`}
                preload="metadata"
                onError={(e) => {
                  console.error("Erro ao carregar o vídeo:", e);
                  // Define um poster de fallback em caso de erro
                  e.currentTarget.poster =
                    "https://placehold.co/600x400/333333/FFFFFF?text=Video";
                }}
                style={{
                  width: "100%",
                  height: "70%",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <Text
                mt={2}
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="semibold"
                textAlign="center"
                color="gray.600"
              >
                {video.nome}
              </Text>
            </Box>
          ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent
          bg="black"
          color="white"
          borderRadius="md"
          overflow="hidden"
        >
          <ModalBody p={0} position="relative" w="100%" h="100%">
            {selectedVideo && (
              <>
                <VideoComponent url={selectedVideo} />
              </>
            )}
            <IconButton
              icon={<CloseIcon />}
              position="absolute"
              top={2}
              right={2}
              colorScheme="red"
              onClick={onClose}
              aria-label="Close"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
