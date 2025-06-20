'use client'
import { Flex, VStack, Box, Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Icon  } from "@chakra-ui/react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function SuporteFaqSenhaEmissao() {

  

  
    return (
      <Flex justifyContent={"center"}>
        <VStack spacing={8} align="start" p={4}>
          <Box>
            <Text fontSize="3xl" fontWeight="bold">
            Senha de Emissão
            </Text>
            <Text mt={2}>
            A senha de Emissão é utilizada para emitir seu Certificado Digital, deve possuir por padrão <br />
            no mínimo 8, e no máximo 12 caracteres, letra maiúscula, letra minúscula, número e caractere especial.
            </Text>
            <Flex 
            mt={4}
            px={4}
            py={4}
            transition="colors 0.2s"
            rounded="md"
            shadow='md'
            _hover={{ borderRadius: "none" }}
            bgGradient="linear(to-b, yellow.100 6%, yellow.100 5%)"
            width="full"
            mx="auto"
            maxW="3xl"
            className="page-api-block"
            ml={{ base: '0', md: 'auto' }}
            gap={2}
            >
            <AiOutlineExclamationCircle />
            <Text>
                Lembrando que sua senha de emissão não é recuperável por esse motivo é importante anotá-la  e guardar em um local seguro.
            </Text>
            </Flex>
            <Text mt={4} fontSize="3xl" fontWeight="bold">Como localizar minha senha de Emissão?</Text>
            <Text mt={6}>Existem três formas de geração da senha de emissão:</Text>
          </Box>
          <Box
            borderWidth={1}
            borderColor="gray.300"
            borderRadius="xl"
            minWidth='550px'
            maxWidth={'550px'}
            boxShadow="xl"
            bg="white"
            p={0}
            overflow="hidden"
            alignSelf={'center'}
          >
            <Accordion allowMultiple>
              {[
                {
                    title: 'Validação Presencial',
                    content:'Se a sua validação foi feita de forma presencial em um de nossos pontos de atendimento, você recebeu o Documento Reservado, que contém as informações de usuário e senha de emissão.​'
                },
                {
                    title: 'Validação por  Videoconferência',
                    content:'Se a sua validação foi feita por videoconferência, a senha de emissão foi gerada automaticamente pelo AGR e apareceu na tela. Você terá a opção de alterá-la no momento da instalação do Certificado.'
                },
                {
                    title: 'Validação por Emissão Online',
                    content: 'Se a sua validação foi feita por Emissão online, a senha de emissão foi criada por você durante o processo de preenchimento de dados.'
                }
              ].map((faq, index) => (
                <AccordionItem key={index} border="none">
                  <h2>
                    <AccordionButton
                      border="hidden"
                      _expanded={{ color: "teal.600", bg: "green.50" }}
                      _hover={{ bg: "green.300" }}
                      transition="all 0.3s"
                    >
                      <Icon
                        as={AccordionIcon}
                        fontSize="2xl"
                        color="teal.500"
                      />
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
          </Box>
        </VStack>
      </Flex>
    );
}