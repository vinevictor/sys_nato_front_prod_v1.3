/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  Box,
  Flex,
  Text,
  VStack,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";


export default function SuporteFaqInstalacaoCertificado() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (src: any) => {
    setSelectedImage(src);
    onOpen();
  };

  return (
    <Flex justifyContent={"center"}>
      <VStack spacing={8} align="start" p={4}>
        <Box>
          <Text fontSize="3xl" fontWeight="bold">
          Instalação do Certificado no APP
          </Text>
          <Text mt={2}>
          Utilizando seu celular, acesse o link de instalação do Certificado Bird ID recebido no e-mail de aprovação, então o aplicativo será aberto.
          </Text>
          <Text mt={4}>
          Nesta tela, preencha os campos de usuário e <b>senha de emissão</b> do Certificado Bird ID. Após inseri-la, clique no botão <b>"Prosseguir"</b>. 
          </Text>
        </Box>
        <Image
          src="/instacertificado1.png"
          alt="Sincronização de dispositivos"
          w={80}
          alignSelf={"center"}
          mt={4}
          borderRadius="md"
          boxShadow="md"
          cursor="pointer"
          onClick={() => handleImageClick("/instacertificado1.png")}
          _hover={{ opacity: 0.8 }}
        />
        <Box>
            <Text fontSize="3xl" fontWeight="bold">
            Conferência de dados
            </Text>
            <Text mt={2}>
            Nesta tela, é necessário validar se os dados que foram fornecidos durante a jornada de validação e emissão do Certificado Bird ID estão corretos e, se necessário, 
            edite as informações antes de prosseguir.
            </Text>
        </Box>
        <Image
          src="/instacertificado2.png"
          alt="Bird ID QR Code"
          w={80}
          alignSelf={"center"}
          mt={4}
          borderRadius="md"
          boxShadow="md"
          cursor="pointer"
          onClick={() => handleImageClick("/instacertificado2.png")}
          _hover={{ opacity: 0.8 }}
        />
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" isCentered>
          <ModalOverlay onClick={onClose} />
          <ModalContent bg="transparent" boxShadow="none">
            <ModalBody display="flex" justifyContent="center">
              {selectedImage && (
                <Image
                  onClick={onClose}
                  src={selectedImage}
                  alt="Expanded Image"
                  borderRadius="md"
                  boxShadow="lg"
                  maxH={["99vh", "99vh", "80vh", "80vh"]}
                  maxW={["99vw", "99vw", "80vw", "80vw"]}
                />
              )}
            </ModalBody>
          </ModalContent>
        </Modal>
      </VStack>
    </Flex>
  );
}
