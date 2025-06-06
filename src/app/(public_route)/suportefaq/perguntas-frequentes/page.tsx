"use client";
import {
  Flex,
  VStack,
  Box,
  Text,
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Icon,
} from "@chakra-ui/react";
import { FaPhone } from "react-icons/fa6";
import { TfiInfoAlt } from "react-icons/tfi";

export default function SuporteFaqPerguntasFrequentes() {
  return (
    <Flex justifyContent={"center"} alignItems="flex-start" mt={5}>
      <VStack spacing={8} align="start" p={4}>
        <Box>
          <Text fontSize="5xl" fontWeight="bold">
            Perguntas Frequentes
          </Text>
          <Flex
            p={3}
            bg="yellow.100"
            rounded={"md"}
            align={"center"}
            maxW={"500px"}
            gap={2}
            shadow={"md"}
          >
            <TfiInfoAlt size={15} />
            <Text mt={2}>
              Caso tenha alguma outra dúvida, consulte abaixo nossa lista de
              perguntas frequentes.
            </Text>
          </Flex>
        </Box>
        <Box
          borderWidth={1}
          borderColor="gray.300"
          borderRadius="xl"
          minWidth="800px"
          maxWidth={"800px"}
          boxShadow="xl"
          bg="white"
          p={0}
          overflow="hidden"
          alignSelf={"center"}
        >
          <Accordion allowMultiple>
            {[
              {
                title: "Como e onde posso utilizar meu Bird ID?",
                content:
                  "A utilização do Bird ID é baseada no código OTP gerado no app. Ele é responsável por validar o uso. Pode ser utilizado em plataformas com integração com a nuvem (como Gov.br).​",
              },
              {
                title:
                  "Posso assinar documentos através do aplicativo Bird ID?",
                content:
                  "Não. O aplicativo do Bird ID é apenas um validador para uso do certificado, ele não tem funcionalidades de assinatura de documentos.",
              },
              {
                title: "Mudei de Celular, e agora?",
                content:
                  "É possível sincronizar o novo celular com o Bird ID, basta baixar o app no novo dispositivo, abri-lo e criar a senha do aplicativo. Uma vez no app, acessar as 3 barrinhas da lateral esquerda e clicar na opção sincronizar. Feito isso, é só preencher com o CPF e a senha Bird ID.",
              },
            ].map((faq, index) => (
              <AccordionItem key={index} border="none">
                <h2>
                  <AccordionButton
                    border="hidden"
                    _expanded={{ color: "teal.600", bg: "green.50" }}
                    _hover={{ bg: "green.300" }}
                    transition="all 0.3s"
                  >
                    <Icon as={AccordionIcon} fontSize="2xl" color="teal.500" />
                    <Box
                      as="span"
                      fontSize="xl"
                      flex="1"
                      textAlign="left"
                      p={2}
                    >
                      {faq.title}
                    </Box>
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} fontSize="md" color="gray.700">
                  {faq.content}
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
          <Flex gap={2} justifyContent={"space-between"} p={4} bg={"blue.100"}>
            <Flex align={"center"}pt={2} gap={2}>
              <FaPhone />
              <Text fontSize={"sm"} size="md">
                Suporte técnico: <b>(16) 3325-4134</b>
              </Text>
            </Flex>
            <Flex flexDirection={'column'}>
            <Text fontSize={'sm'}><b>Horário de atendimento:</b> </Text>
            <Text fontSize="sm">
              Segunda a sexta das 09h às 17h <br />
              Sábado das 09h às 12h
            </Text>
            </Flex>
          </Flex>
        </Box>
      </VStack>
    </Flex>
  );
}