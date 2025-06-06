"use client";
import {
  Box,
  Flex,
  VStack,
  Text,
  IconButton,
  Collapse,
} from "@chakra-ui/react";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import {
  FcTwoSmartphones,
  FcUnlock,
  FcDocument,
  FcHighPriority,
} from "react-icons/fc";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BsPersonVideo } from "react-icons/bs";

export default function Sidebar() {
  const [expanded, setExpanded] = useState<number>(0);
  const router = useRouter();

  const toggleExpand = (section: number) => {
    setExpanded(expanded === section ? 0 : section);
  };

  const handleGuiaUsuario = (r: any) => {
    router.push(r);
  };

  return (
    <Flex
      h="90vh"
      minW={"10vw"}
      w="fit-content"
      bg="white"
      color="black"
      direction="column"
      paddingTop={4}
      boxShadow="lg"
      textAlign="center"
      overflowY="auto"
    >
      <Flex
        alignSelf={"center"}
        onClick={() => {setExpanded(0); handleGuiaUsuario("/suportefaq")}}
        _hover={{ cursor: "pointer" }}
      >
        <Text
          fontSize="2xl"
          _hover={{ textDecoration: "underline" }}
          fontWeight="bold"
          mb={4}
          color="green.700"
        >
          Guia de ajuda 💬
        </Text>
      </Flex>
      <VStack align="stretch" spacing={4}>
        <Box>
          <Flex
            align="center"
            _hover={{ bg: "green.100", cursor: "pointer" }}
            onClick={() => {
              toggleExpand(1);
            }}
            bg={expanded === 1 ? "green.100" : "transparent"}
            p={2}
          >
            <FcTwoSmartphones size={20} />
            <Text ml={2} fontWeight="medium">
              Aplicativo Bird ID
            </Text>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(1);
              }}
              ml="auto"
              _hover={{ bg: "transparent" }}
              icon={expanded === 1 ? <FaChevronDown /> : <FaChevronRight />}
              variant="ghost"
              aria-label="Toggle first section"
            />
          </Flex>
          <Collapse in={expanded === 1} animateOpacity>
            <VStack mt={2} align="start" pl={4} spacing={2}>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/primeiro-acesso");
                }}
                _hover={{ color: "teal.300" }}
              >
                Primeiro Acesso Bird ID
              </Text>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/biometria-senha");
                }}
                _hover={{ color: "teal.300" }}
              >
                Login - Biometria ou Senha
              </Text>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/instalacao-certificado-app");
                }}
                _hover={{ color: "teal.300" }}
              >
                Instalação do Certificado no APP
              </Text>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/sincronizar-conta");
                }}
                _hover={{ color: "teal.300" }}
              >
                Sincronizar conta Bird ID
              </Text>
            </VStack>
          </Collapse>

          <Flex
            align="center"
            _hover={{ bg: "green.100", cursor: "pointer" }}
            onClick={() => {
              toggleExpand(2);
            }}
            bg={expanded === 2 ? "green.100" : "transparent"}
            p={2}
          >
            <FcUnlock size={20} />
            <Text ml={2} fontWeight="medium">
              Senhas Bird ID
            </Text>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(2);
              }}
              ml="auto"
              _hover={{ bg: "transparent" }}
              icon={expanded === 2 ? <FaChevronDown /> : <FaChevronRight />}
              variant="ghost"
              aria-label="Toggle first section"
            />
          </Flex>
          <Collapse in={expanded === 2} animateOpacity>
            <VStack mt={2} align="start" pl={4} spacing={2}>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/senha-emissao");
                }}
                _hover={{ color: "teal.300" }}
              >
                Senha de Emissão
              </Text>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/senha-app");
                }}
                _hover={{ color: "teal.300" }}
              >
                Senha do APP
              </Text>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/senha-bird-id");
                }}
                _hover={{ color: "teal.300" }}
              >
                Senha do Bird ID
              </Text>
              <Text 
              cursor={"pointer"}
              p={2}
              onClick={() => {
                handleGuiaUsuario("/suportefaq/recuperacao-senhas");
              }}
              _hover={{ color: "teal.300" }}
              >Recuperação de Senhas</Text>
            </VStack>
          </Collapse>

          <Flex
            align="center"
            _hover={{ bg: "green.100", cursor: "pointer" }}
            onClick={() => {
              toggleExpand(3);
            }}
            bg={expanded === 3 ? "green.100" : "transparent"}
            p={2}
          >
            <FcDocument size={20} />
            <Text ml={2} fontWeight="medium">
              Utilizando o seu Bird ID
            </Text>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(3);
              }}
              ml="auto"
              _hover={{ bg: "transparent" }}
              icon={expanded === 3 ? <FaChevronDown /> : <FaChevronRight />}
              variant="ghost"
              aria-label="Toggle first section"
            />
          </Flex>
          <Collapse in={expanded === 3} animateOpacity>
            <VStack mt={2} align="start" pl={4} spacing={2}>
              <Text
                cursor="pointer"
                p={2}
                onClick={() => {
                  handleGuiaUsuario("/suportefaq/autenticacao-gov");
                }}
                _hover={{ color: "teal.300" }}
              >
                Autenticação no Gov.br
              </Text>
            </VStack>
          </Collapse>

          <Flex
            align="center"
            _hover={{ bg: "green.100", cursor: "pointer" }}
            bg={expanded === 4 ? "green.100" : "transparent"}
            p={4}
            onClick={() => {toggleExpand(4); handleGuiaUsuario("/suportefaq/perguntas-frequentes")}}
          >
            <FcHighPriority size={20} />
            <Text ml={2} fontWeight="medium">
              Perguntas Frequentes 
            </Text>
          </Flex>
          <Flex
            align="center"
            _hover={{ bg: "green.100", cursor: "pointer" }}
            bg={expanded === 5 ? "green.100" : "transparent"}
            p={4}
            onClick={() => {toggleExpand(5); handleGuiaUsuario("/suportefaq/videos-tutoriais")}}
          >
            <BsPersonVideo size={20} color="teal"/>
            <Text ml={2} fontWeight="medium">
              Videos Tutoriais
            </Text>
          </Flex>
        </Box>
      </VStack>
    </Flex>
  );
}
