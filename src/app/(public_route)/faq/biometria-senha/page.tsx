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
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import { useState } from "react";


export default function SuporteFaqBiometriaSenha() {
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
          Login - Biometria ou Senha
          </Text>
          <Text mt={2}>
          Na tela de login, você terá duas opções para acessar a sua conta:
          </Text>
          <Box ml={6}>
          <UnorderedList>
            <ListItem>
                <Text mt={4}>
                    <b>Acesso com Senha:</b> Insira a senha de acesso cadastrada anteriormente no campo designado. <br /> Após preencher, prossiga para fazer login no aplicativo.
                </Text>
            </ListItem>
            <ListItem>
                <Text mt={2}>
                <b>Acesso com Biometria:</b> Se a opção de acesso com biometria estiver ativada, o dispositivo <br /> solicitará que faça a autenticação usando a biometria registrada no dispositivo. 
                </Text>
            </ListItem>
          </UnorderedList>
          </Box>
          <Text mt={4}>
          Isso pode ser feito através de leitura de impressões digitais, reconhecimento facial (como o Face ID) <br /> ou qualquer outro método de autenticação biométrica disponível no dispositivo.
          </Text>
        </Box>
        <Image
          src="/faqlogin1.png"
          alt="Acesso com Biometria ou Senha"
          w={80}
          alignSelf={"center"}
          mt={4}
          borderRadius="md"
          boxShadow="md"
          cursor="pointer"
          onClick={() => handleImageClick("/faqlogin1.png")}
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
