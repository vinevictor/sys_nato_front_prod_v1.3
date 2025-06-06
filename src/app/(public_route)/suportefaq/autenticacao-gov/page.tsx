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
  ListItem,
  OrderedList,
  Link,
} from "@chakra-ui/react";
import { useState } from "react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function SuporteFaqAutenticacaoGov() {
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
            Autenticação no Gov.br
          </Text>
          <Text mt={2}>
            Para acessar o Gov.br com seu Certificado Digital Bird ID,{" "}
            <Link color={"blue"} href="https://servicos.acesso.gov.br/">
              clique aqui
            </Link>
            .
          </Text>
          <Box>
            <OrderedList>
              <ListItem>
                <Text mt={4}>
                  Após acessar o site, clique na opção “Seu Certificado Digital
                  em nuvem”
                </Text>
                <Image
                  src="/gov/autenticacao-gov1.png"
                  alt="Gov.br"
                  alignSelf={"center"}
                  w={"200px"}
                  mt={4}
                  borderRadius="md"
                  boxShadow="md"
                  cursor="pointer"
                  onClick={() => handleImageClick("/gov/autenticacao-gov1.png")}
                  _hover={{ opacity: 0.8 }}
                />
              </ListItem>
              <ListItem>
                <Text mt={2}>Clique na opção “Bird ID”</Text>
                <Image
                  src="/gov/autenticacao-gov2.png"
                  alt="Gov.br"
                  alignSelf={"center"}
                  w={"200px"}
                  mt={4}
                  borderRadius="md"
                  boxShadow="md"
                  cursor="pointer"
                  onClick={() => handleImageClick("/gov/autenticacao-gov2.png")}
                  _hover={{ opacity: 0.8 }}
                />
              </ListItem>
              <ListItem>
                <Text mt={2}>
                  Informe seu CPF e o código OTP, depois clique em “Continuar”
                </Text>
                <Image
                  src="/gov/autenticacao-gov3.png"
                  alt="Gov.br"
                  alignSelf={"center"}
                  w={"200px"}
                  mt={4}
                  borderRadius="md"
                  boxShadow="md"
                  cursor="pointer"
                  onClick={() => handleImageClick("/gov/autenticacao-gov3.png")}
                  _hover={{ opacity: 0.8 }}
                />
              </ListItem>
              <Flex mt={4} gap={2}  maxW={'500px'} bg={'blue.100'} rounded={'md'} p={2}>
              <AiOutlineExclamationCircle size={25}/>
                <Text>
                  Seu Código OTP é gerado pelo aplicativo do Bird ID no seu
                  Smartphone. Ele é composto por 6 numerais que mudam a cada
                  trinta segundos.
                </Text>
              </Flex>
              <ListItem>
                <Text mt={2}>
                Agora clique na opção “Autorizar Aplicação” e Pronto! 
                </Text>
                <Image
                  src="/gov/autenticacao-gov4.png"
                  alt="Gov.br"
                  alignSelf={"center"}
                  w={"200px"}
                  mt={4}
                  borderRadius="md"
                  boxShadow="md"
                  cursor="pointer"
                  onClick={() => handleImageClick("/gov/autenticacao-gov4.png")}
                  _hover={{ opacity: 0.8 }}
                  />
              </ListItem>
            </OrderedList>
          </Box>
        </Box>
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
