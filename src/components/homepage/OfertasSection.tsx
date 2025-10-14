// 'use client';

// import {
//   Box,
//   Button,
//   Container,
//   Heading,
//   HStack,
//   Text,
//   VStack,
//   Card,
//   CardBody,
//   Badge,
//   SimpleGrid,
//   useColorModeValue
// } from '@chakra-ui/react';

// /**
//  * Seção de ofertas disponíveis
//  * Utiliza client component para hooks do Chakra UI
//  */
// export default function OfertasSection() {
//   const cardBg = useColorModeValue('white', 'gray.800');
//   const textColor = useColorModeValue('gray.600', 'gray.300');

//   return (
//     <Box id="servicos" py={20} bg="gray.50">
//       <Container maxW="7xl">
//         <VStack spacing={12}>
//           <VStack spacing={4} textAlign="center">
//             <Heading size="xl" color="gray.800">
//               Nossos Serviços
//             </Heading>
//             <Text fontSize="lg" color={textColor} maxW="2xl">
//               Soluções completas para gestão digital de documentos imobiliários com certificação ICP e sistema antifraude
//             </Text>
//           </VStack>

//           <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8} w="full">
//               {/* Serviço 1 - Certificação ICP */}
//               <Card bg={cardBg} shadow="lg" _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}>
//                 <CardBody>
//                   <VStack align="stretch" spacing={4}>
//                     <HStack justify="space-between">
//                       <Badge colorScheme="blue" variant="solid">
//                         Certificação Digital
//                       </Badge>
//                       <Badge colorScheme="green" variant="outline">
//                         ICP-Brasil
//                       </Badge>
//                     </HStack>
                    
//                     <Heading size="md" color="gray.800">
//                       Certificado Digital Qualificado
//                     </Heading>
                    
//                     <Text color={textColor} fontSize="sm">
//                       Certificação digital do tipo ICP para assinatura de documentos imobiliários com validade jurídica
//                     </Text>
                    
//                     <VStack align="stretch" spacing={2}>
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Validade:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           3 anos
//                         </Text>
//                       </HStack>
                      
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Tipo:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           A3 em Nuvem BirdID
//                         </Text>
//                       </HStack>
                      
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Suporte:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           24/7
//                         </Text>
//                       </HStack>
//                     </VStack>
                    
//                     <Button colorScheme="green" size="sm" w="full">
//                       Usar o Sistema
//                     </Button>
//                   </VStack>
//                 </CardBody>
//               </Card>

//               {/* Serviço 2 - Sistema Antifraude */}
//               <Card bg={cardBg} shadow="lg" _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}>
//                 <CardBody>
//                   <VStack align="stretch" spacing={4}>
//                     <HStack justify="space-between">
//                       <Badge colorScheme="red" variant="solid">
//                         Segurança
//                       </Badge>
//                       <Badge colorScheme="orange" variant="outline">
//                         Antifraude
//                       </Badge>
//                     </HStack>
                    
//                     <Heading size="md" color="gray.800">
//                       Análise de Documentos
//                     </Heading>
                    
//                     <Text color={textColor} fontSize="sm">
//                       Sistema inteligente de análise documental para prevenção de fraudes em transações imobiliárias
//                     </Text>
                    
//                     <VStack align="stretch" spacing={2}>
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Precisão:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           99,8%
//                         </Text>
//                       </HStack>
                      
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Tempo de análise:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           Até 2 horas
//                         </Text>
//                       </HStack>
                      
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Relatório:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           Detalhado
//                         </Text>
//                       </HStack>
//                     </VStack>
                    
//                     <Button
//                       as="a"
//                       href="https://wa.me/5516992800713?text=Olá! Gostaria de testar a análise antifraude do SisNATO e conhecer mais sobre a certificação digital ICP A3 em nuvem BirdID."
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       colorScheme="green"
//                       size="md"
//                       w="full"
//                     >
//                       Testar Análise
//                     </Button>
//                   </VStack>
//                 </CardBody>
//               </Card>

//               {/* Serviço 3 - Consultoria Especializada */}
//               <Card bg={cardBg} shadow="lg" _hover={{ transform: 'translateY(-4px)', transition: 'all 0.2s' }}>
//                 <CardBody>
//                   <VStack align="stretch" spacing={4}>
//                     <HStack justify="space-between">
//                       <Badge colorScheme="purple" variant="solid">
//                         Consultoria
//                       </Badge>
//                       <Badge colorScheme="blue" variant="outline">
//                         Especializada
//                       </Badge>
//                     </HStack>
                    
//                     <Heading size="md" color="gray.800">
//                       Suporte Personalizado
//                     </Heading>
                    
//                     <Text color={textColor} fontSize="sm">
//                       Atendimento especializado para explicar processos e agendar certificação digital
//                     </Text>
                    
//                     <VStack align="stretch" spacing={2}>
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Atendimento:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           Personalizado
//                         </Text>
//                       </HStack>
                      
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Agendamento:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           Online/Presencial
//                         </Text>
//                       </HStack>
                      
//                       <HStack justify="space-between">
//                         <Text fontSize="sm" color={textColor}>
//                           Suporte:
//                         </Text>
//                         <Text fontSize="sm" fontWeight="bold">
//                           Completo
//                         </Text>
//                       </HStack>
//                     </VStack>
                    
//                     <Button
//                       as="a"
//                       href="https://wa.me/5516992800713?text=Olá! Tenho interesse na consultoria especializada do SisNATO e gostaria de falar com um especialista sobre como agendar minha certificação digital ICP."
//                       target="_blank"
//                       rel="noopener noreferrer"
//                       variant="outline"
//                       colorScheme="green"
//                       size="md"
//                       w="full"
//                     >
//                       Falar com Especialista
//                     </Button>
//                   </VStack>
//                 </CardBody>
//               </Card>
//           </SimpleGrid>
//         </VStack>
//       </Container>
//     </Box>
//   );
// }
