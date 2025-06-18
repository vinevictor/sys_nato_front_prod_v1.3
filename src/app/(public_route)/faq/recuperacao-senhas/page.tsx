'use client'
import { Flex, VStack, Box, Text, Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel, Icon, Link, Divider  } from "@chakra-ui/react";
import { AiOutlineExclamationCircle } from "react-icons/ai";

export default function SuporteFaqSenhaEmissao() {

  

  
    return (
      <Flex justifyContent={"center"}>
        <VStack spacing={8} w={'35vw'} align="start" p={4}>
          <Box>
            <Text fontSize="3xl" fontWeight="bold">
            Recuperação de senhas
            </Text>
            <Text mt={2}>
            Cada uma das senhas exige uma maneira de recuperação.
            </Text>
            <Text mt={4} fontSize="3xl" fontWeight="bold">Recuperar senha de Emissão</Text>
            <Text mt={6}>Sua senha de Emissão <b>não é recuperável</b>, ou seja, caso perca a senha não é possível criar uma nova. Sendo assim, será necessário <b>Revogar seu Certificado Digital</b>, e refazer todo o processo de validação, veja como realizar esse procedimento a seguir:    </Text>
          </Box>
          <Box
            borderWidth={1}
            borderColor="gray.300"
            borderRadius="xl"
            minWidth={'30vw'}
            maxWidth={'30vw'}
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
                    content:'Se a sua validação foi feita de forma presencial em um de nossos pontos de atendimento, você deverá ir até a unidade em que foi feita a validação e pedir a revogação do seu Certificado Digital. Na unidade será possível refazer todo o processo após a revogação.​'
                },
                {
                    title: 'Validação por  Videoconferência',
                    content:<span>
                        Se a sua validação foi feita por videoconferência, será necessário enviar um e-mail solicitando a Revogação para o endereço:<Link color={"blue"}>videoconferencia@soluti.com.br</Link> , é necessário incluir no e-mail o Código de solicitação e o motivo da revogação.
                    </span>
                },
                {
                    title: 'Validação por Emissão Online',
                    content: 'Se a sua validação foi feita por Emissão online, será necessário enviar um e-mail solicitando a Revogação para o endereço: emissao.online@soluti.com.br, é necessário incluir no e-mail o Código de solicitação, o motivo da revogação, foto do documento de identificação e uma carta a próprio punho em anexo. A carta deve conter nome completo, CPF e CNPJ (se PJ) e o motivo da revogação. Ao final, o titular deve assinar conforme documento de identidade apresentado.'
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
          <Divider mt={8} />
          <Text fontSize="3xl" fontWeight="bold">Recuperar Senha do APP</Text>
          <Text mt={2}>Por questões de segurança, não é possível recuperar sua senha do aplicativo, mas você pode redefinir o aplicativo e criar uma nova senha.</Text>
          <Text mt={1}>Após a redefinição, será necessário sincronizar sua conta novamente.Para realizar essa sincronização, é essencial que você se lembre da senha de acesso à sua conta Bird ID.</Text>

          <Flex mt={4} gap={2} alignSelf={'center'}  maxW={'500px'} bg={'blue.100'} rounded={'md'} p={2}>
              <AiOutlineExclamationCircle size={25}/>
                <Text>
                Sua senha do APP pode ter no mínimo 8, e no máximo 12 caracteres, letras maiúsculas, letras minúsculas e números.
                </Text>
              </Flex>

              <Box display="flex" justifyContent="center" mt={6}>
          <Flex w="80%" maxW="900px" borderRadius="md" justifyContent={'center'} overflow="hidden">
            
            <video width="70%" height="400" controls>
              <source src="/video/recuperarsenhaportal.mp4" type="video/mp4" />
              Seu navegador não suporta o elemento de vídeo.
            </video>
          </Flex>
        </Box>


        </VStack>
      </Flex>
    );
}