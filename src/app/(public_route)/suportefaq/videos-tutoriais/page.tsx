"use client";

import {
  Flex,
  VStack,
  Box,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { CloseIcon } from "@chakra-ui/icons";

export default function SuporteFaqPerguntasFrequentes() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [videos, setVideoList] = useState<any[]>([]);

  useEffect(() => { 
    const fetchData = async () => {
      try {
        const videos = await fetchVideos();
        setVideoList(videos);
      } catch (error) {
        console.error("Erro ao buscar vídeos:", error);
      }
    };

    fetchData();
  }, []);
  const fetchVideos = async (): Promise<any[]> => {
    const res = await fetch("/api/videosfaq/getall");
    const data = await res.json();
    console.log(data);
    return data;
  };

  const handleVideoClick = (videoUrl: string) => {
    setSelectedVideo(videoUrl);
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
        {videos.map((video, index) => (
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
            onClick={() => handleVideoClick(video.src)}
          >
            <video
              src={video.src}
              style={{ width: "100%", height: "70%", objectFit: "cover", borderRadius: "8px" }}
            />
            <Text
              mt={2}
              fontSize={{ base: "sm", md: "md" }}
              fontWeight="semibold"
              textAlign="center"
              color="gray.600"
            >
              {video.title}
            </Text>
          </Box>
        ))}
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent bg="black" color="white" borderRadius="md" overflow="hidden">
          <ModalBody p={0} position="relative">
            {selectedVideo && (
              <>
                <video
                  src={selectedVideo}
                  style={{ width: "100%" }}
                  controls
                  autoPlay
                />
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
