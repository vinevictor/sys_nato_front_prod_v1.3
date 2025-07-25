"use client";

import { Box, Flex, Text, useToast, VStack, Image } from "@chakra-ui/react";
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
  const [videos, setVideoList] = useState<Video[] | null>(null);
  const [thumbnails, setThumbnails] = useState<Record<string, string>>({});
  const toast = useToast();

  const generateThumbnail = (videoUrl: string): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.muted = true;
      
      video.onloadedmetadata = () => {
        video.currentTime = 2; // Captura frame aos 2 segundos
      };
      
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          ctx.drawImage(video, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M120 60l60 40-60 40V60z' fill='%23666'/%3E%3C/svg%3E");
        }
      };
      
      video.onerror = () => {
        resolve("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M120 60l60 40-60 40V60z' fill='%23666'/%3E%3C/svg%3E");
      };
      
      video.src = videoUrl;
    });
  };

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/faq");
        const data = await res.json();
        setVideoList(data.video);

        if (data.video.length > 0) {
          const thumbs: Record<string, string> = {};
          
          for (const video of data.video) {
            try {
              const thumbnail = await generateThumbnail(video.url);
              thumbs[video.url] = thumbnail;
            } catch (error) {
              console.error(`Erro ao gerar thumbnail para ${video.url}:`, error);
              thumbs[video.url] = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f0f0f0'/%3E%3Cpath d='M120 60l60 40-60 40V60z' fill='%23666'/%3E%3C/svg%3E";
            }
          }
          
          setThumbnails(thumbs);
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
    window.open(videoUrl, '_blank');
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
              <Box
                position="relative"
                width="100%"
                height="70%"
                borderRadius="8px"
                overflow="hidden"
                backgroundColor="#f0f0f0"
              >
                <Image
                  src={`https://api.microlink.io/?url=${encodeURIComponent(
                  video.url
                )}&screenshot=true&meta=false&embed=screenshot.url`}
                  alt={`Thumbnail ${video.nome}`}
                  width="100%"
                  height="100%"
                  objectFit="cover"
                />
                {/* Ícone de play sobreposto */}
                <Box
                  position="absolute"
                  top="50%"
                  left="50%"
                  transform="translate(-50%, -50%)"
                  backgroundColor="rgba(0, 0, 0, 0.7)"
                  borderRadius="50%"
                  width="50px"
                  height="50px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  transition="all 0.3s ease"
                  _hover={{ backgroundColor: "rgba(0, 0, 0, 0.9)", transform: "translate(-50%, -50%) scale(1.1)" }}
                >
                  <Box
                    width="0"
                    height="0"
                    borderLeft="15px solid white"
                    borderTop="10px solid transparent"
                    borderBottom="10px solid transparent"
                    marginLeft="3px"
                  />
                </Box>
              </Box>
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

    </Flex>
  );
}