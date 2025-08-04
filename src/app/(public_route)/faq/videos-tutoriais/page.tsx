"use client";

import Loading from "@/app/loading";
import { Box, Flex, Text, useToast, VStack, Image } from "@chakra-ui/react";
import { Suspense, useEffect, useState } from "react";

interface Video {
  id: number;
  url: string;
  nome: string;
  tag: string;
  createAt: string;
}

// Transformar em componente React
function VideoList() {
  const [videos, setVideoList] = useState<Video[] | null>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/faq");
        const data = await res.json();
        if (data) {
          // esperar 3 segundos
          await new Promise((resolve) => setTimeout(resolve, 3000));
          setVideoList(data);
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
      } finally {
        setLoading(false);
      }
    })();
  }, [toast]);

  const handleVideoClick = (videoUrl: string) => {
    window.open(videoUrl, '_blank');
  };

  if (loading) {
    return <Loading />;
  }

  if (!videos || videos.length === 0) {
    return (
      <Text fontSize="lg" color="gray.500" textAlign="center">
        Nenhum vídeo encontrado
      </Text>
    );
  }

  return (
    <>
      {videos.map((video: Video) => (
        <Box
          key={video.id} // Usar o ID único em vez do index
          as="div"
          // overflow="hidden"
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
              _hover={{ 
                backgroundColor: "rgba(0, 0, 0, 0.9)", 
                transform: "translate(-50%, -50%) scale(1.1)" 
              }}
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
    </>
  );
}

export default function SuporteFaqPerguntasFrequentes() {
  return (
    <Flex justify="center" align="center" flexDirection="column" p={4} mt={5}>
      <VStack spacing={8} align="center">
        <Box>
          <Text fontSize="5xl" fontWeight="bold" textAlign="center">
            Vídeos e Tutoriais
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
        <Suspense fallback={<Loading />}>
          <VideoList />
        </Suspense>
      </Flex>
    </Flex>
  );
}