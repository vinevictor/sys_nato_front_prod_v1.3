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

export default function SuporteFaqSincronizarConta() {
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
            Sincronizar conta Bird ID
          </Text>
          <Text mt={2}>
            O primeiro passo para sincronizar sua conta do Portal Bird ID com o
            aplicativo é o preenchimento de <b>CPF</b> e <b>senha Bird ID</b>.
          </Text>
          <Text mt={2}>
            Com sua conta já criada, você terá 2 opções para validar o login em
            duas etapas. Escolha entre as seguintes opções:
          </Text>
          <Box ml={6}>
            <UnorderedList>
              <ListItem>
                <Text mt={4}>
                  <b>Validação por E-mail ou SMS:</b> Você receberá um código de
                  validação em seu e-mail registrado <br />
                  ou por meio de uma mensagem SMS enviada para o número de
                  telefone registrado em seu perfil. <br />
                  Após receber o código deve inseri-lo na próxima tela para
                  concluir a validação em duas etapas.
                </Text>
              </ListItem>
              <ListItem>
                <Text mt={2}>
                <b>Validação por Código OTP:</b> Utilizar um código OTP gerado por outro dispositivo previamente <br />
                 sincronizado com a sua conta do Portal Bird ID. Nesse caso, você deverá inserir o código OTP <br />
                 gerado no dispositivo sincronizado para prosseguir com a validação em duas etapas.
                </Text>
              </ListItem>
            </UnorderedList>
          </Box>
          <Text mt={6}>
          Por último, basta preencher o campo de código de validação com o código recebido <br /> 
          ou gerado previamente para finalizar sua sincronização com sucesso.
          </Text>
        </Box>
        <Image
          src="/sincronizarconta.png"
          alt="Bird ID QR Code"
          w={'30vw'}
          alignSelf={"center"}
          mt={4}
          borderRadius="md"
          boxShadow="md"
          cursor="pointer"
          onClick={() => handleImageClick("/sincronizarconta.png")}
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
