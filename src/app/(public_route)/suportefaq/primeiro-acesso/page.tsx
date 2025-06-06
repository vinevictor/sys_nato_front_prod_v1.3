/* eslint-disable react/no-unescaped-entities */
"use client";
import {
  Box,
  Flex,
  Link,
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
import { FaGooglePlay, FaApple } from "react-icons/fa6";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function SuporteFaqPrimeiroAcesso() {
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
            Primeiro Acesso
          </Text>
          <Text mt={2}>
            Esses são os primeiros passos para você utilizar o aplicativo Bird
            ID.
          </Text>
          <Text mt={4}>
            Seu primeiro passo é baixar o aplicativo no seu smartphone:
          </Text>
          <VStack align="start" mt={2} spacing={2}>
            <Flex align="center">
              <FaGooglePlay style={{ marginRight: "8px" }} />
              <Link
                color="blue.500"
                href="https://play.google.com/store/search?q=bird+id&c=apps&hl=pt_BR"
                isExternal
              >
                Bird ID: Certificado Digital
              </Link>
            </Flex>
            <Flex align="center">
              <FaApple style={{ marginRight: "8px" }} />
              <Link
                color="blue.500"
                href="https://apps.apple.com/br/app/bird-id/id1450002184"
                isExternal
              >
                Bird ID
              </Link>
            </Flex>
          </VStack>
        </Box>

        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            QR Code de Instalação
          </Text>
          <Text mt={2}>
            Após a aprovação do Certificado, você receberá um e-mail com
            instruções para a{" "}
            <b>instalação do Certificado Digital em nuvem Bird ID.</b>
          </Text>
        </Box>

        <Image
          src="/primeiroacesso1.avif"
          alt="Bird ID QR Code"
          w={80}
          alignSelf={"center"}
          mt={4}
          borderRadius="md"
          boxShadow="md"
          cursor="pointer"
          onClick={() => handleImageClick("/primeiroacesso1.avif")}
          _hover={{ opacity: 0.8 }}
        />

        <Box>
          <Text fontSize="2xl" fontWeight="bold">
            Abrindo o aplicativo
          </Text>
          <Text mt={2}>
            Ao chegar à última tela de apresentação, clique no botão{" "}
            <b>"Começar"</b>. Ao clicar nele, será direcionado para a próxima
            tela de criação da senha de acesso ao aplicativo.
          </Text>
        </Box>

        <Image
          src="/primeiroacesso2.png"
          alt="Bird ID Primeiros Passos"
          w={"30vw"}
          alignSelf={"center"}
          mt={4}
          borderRadius="md"
          boxShadow="md"  
          cursor={"pointer"}
          onClick={() => handleImageClick("/primeiroacesso2.png")}
          _hover={{ opacity: 0.8 }}
        />
        <Box>
          <Text fontSize={"2xl"} fontWeight={"bold"}>
          Criação de Senha
          </Text>
          <Text mt={2}>
          Na tela de criação de senha do APP, defina uma senha para acessar o aplicativo.  No campo, insira uma senha que atenda aos requisitos de segurança.
          </Text>
          <Flex 
          mt={4} 
          align="center"
          p={4} 
          bg={'blue.100'}
          borderRadius={'md'}
          w={'fit-content'}
          gap={2}
          justifySelf={'center'}
          >
            <AiOutlineExclamationCircle />
            <Text>
            Ela  deve ter entre 8 e 12 caracteres e incluir pelo menos uma letra maiúscula, uma letra minúscula e números.
            </Text>
          </Flex>
          <Text mt={2}>
          Após preencher ambos os campos com uma senha válida, clique no botão <b>"Criar Senha"</b>
          </Text>
        </Box>
        <Image
          src="/primeiroacesso3.png"
          alt="Criar Uma Senha do APP"
          w={80}
          alignSelf={"center"}
          mt={4}
          borderRadius="md"
          boxShadow="md"
          cursor="pointer"
          onClick={() => handleImageClick("/primeiroacesso3.png")}
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
