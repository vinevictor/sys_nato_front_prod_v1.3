"use client";
import {
  Flex,
  VStack,
  Box,
  Text,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useState } from "react";
import { BsExclamationTriangle } from "react-icons/bs";

export default function SuporteFaqSenhaApp() {
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
            Senha do APP
          </Text>
          <Text mt={2}>
            A senha do APP ou PIN é a senha do seu <b>aplicativo Bird ID</b>{" "}
            utilizada para fazer login no aplicativo e <br />
            <b>não possui relação com seu Certificado Digital</b>, sua senha
            deve possuir por padrão no mínimo 8, <br />e no máximo 12
            caracteres, letra maiúscula, letra minúscula e número.
          </Text>
          <Text mt={5} fontSize="2xl" fontWeight="bold">
            Como localizar minha senha do APP?
          </Text>
          <Text mt={6}>
            A senha do APP ou PIN é criada no primeiro acesso ao aplicativo do
            Bird ID no seu celular, nesta tela:
          </Text>
        </Box>
        <Image
          src="/senhaapp.avif"
          alt="Criar senha do APP"
          alignSelf={"center"}
          w={300}
          mt={4}
          borderRadius="md"
          boxShadow="md"
          cursor="pointer"
          onClick={() => handleImageClick("/senhaapp.avif")}
          _hover={{ opacity: 0.8 }}
        />

        <Flex
          align={"center"}
          alignSelf={"center"}
          gap={2}
          p={4}
          bg={"red.100"}
          rounded={"md"}
          maxW={"500px"}
          shadow={'md'}
        >
          <BsExclamationTriangle />
          <Text>
            Por ser criada pelo usuário, a{" "}
            <b>Soluti não tem acesso a essa senha</b>, sendo importante que a
            anote e guarde em um local seguro.
          </Text>
        </Flex>
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
