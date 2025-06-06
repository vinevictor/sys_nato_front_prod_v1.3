// "use client";
// import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
// import {
//   Box,
//   Flex,
//   FormControl,
//   FormLabel,
//   Text,
//   Textarea,
//   Image,
//   IconButton,
//   Button,
//   Badge,
//   Icon,
// } from "@chakra-ui/react";
// import React, { useEffect, useState } from "react";
// import { IoMdDownload } from "react-icons/io";

// interface ImageData {
//   url_download: string;
//   url_view: string;
// }
// interface RespostaChamadoProps {
//   data: {
//     resposta: string;
//     images_adm: string;
//     idResposta: string;
//     updatedAt: string;
//   };
//   session: any;
// }

// export default function RespostaChamado({
//   data,
//   session,
// }: RespostaChamadoProps) {
//   const [userResposta, setUserResposta] = useState<any | null>(null);
//   const [mostrarResposta, setMostrarResposta] = useState(false);

//   // Parse image URLs safely
//   const urls: ImageData[] = data.images_adm ? (data.images_adm as any) : [];
//   const urlsView = urls.map((item) => item.url_download);
//   const urlsDownload = urls.map((item) => item.url_view);

//   useEffect(() => {
//     const fetchUserResposta = async () => {
//       try {
//         const response = await fetch(`/api/usuario/getId/${data.idResposta}`);
//         if (!response.ok) {
//           throw new Error("Failed to fetch user response");
//         }
//         const res = await response.json();
//         setUserResposta(res);
//       } catch (error) {
//         console.error("Error fetching user response:", error);
//       }
//     };

//     fetchUserResposta();
//   }, [data.idResposta]);

//   const renderResponseContent = () => (
//     <Flex
//       direction="column"
//       p={8}
//       borderWidth={1}
//       borderRadius="lg"
//       shadow="lg"
//       bg="white"
//       gap={6}
//       w={"100%"}
//       maxWidth="800px"
//       mx="auto"
//     >
//       <FormControl>
//         <FormLabel>Resposta do Usuário:</FormLabel>
//         <Textarea value={data.resposta} readOnly w={"100%"} />
//       </FormControl>

//       {urlsView.length > 0 && (
//         <Box>
//           <Text mb={4}>Arquivos:</Text>
//           <Flex wrap="wrap" gap={8} justify="center" align="center">
//             {urlsView.map((item, index) => (
//               <Box
//                 key={item}
//                 position="relative"
//                 boxSize={{ base: "100px", md: "150px", lg: "150px" }}
//                 borderRadius="md"
//                 shadow="sm"
//                 overflow="hidden"
//               >
//                 <Image
//                   src={item}
//                   objectFit="cover"
//                   alt={`Imagem ${index + 1}`}
//                   w="100%"
//                   h="100%"
//                   borderRadius="md"
//                 />
//                 <Box position="absolute" top="8px" right="8px">
//                   <a href={urlsDownload[index]} download>
//                     <IconButton
//                       icon={<IoMdDownload />}
//                       aria-label="Download"
//                       size="sm"
//                       colorScheme="blue"
//                       variant="solid"
//                       shadow="md"
//                     />
//                   </a>
//                 </Box>
//               </Box>
//             ))}
//           </Flex>
//         </Box>
//       )}
//     </Flex>
//   );

//   return (
//     <>
//       <Flex flexDirection={"column"} gap={2} w={"100%"}>
//         <Flex gap={1} flexDirection={"column"}>
//           <Flex gap={4}>
//             <Text>Resposta do Usuário: {userResposta?.nome}</Text>
//             {session === "ADM" ? (
//               <Text>
//                 User ID:{" "}
//                 <Badge size={"sm"} variant={"solid"} colorScheme="blue">
//                   {userResposta?.id}
//                 </Badge>
//               </Text>
//             ) : (
//               <></>
//             )}
//           </Flex>
//           <Text>
//             Data da Resposta: {new Date(data.updatedAt).toLocaleTimeString()},{" "}
//             {new Date(data.updatedAt).toLocaleDateString()}
//           </Text>
//         </Flex>

//         <Button
//           onClick={() => setMostrarResposta(!mostrarResposta)}
//           mb={4}
//           size="sm"
//           w="fit-content"
//           colorScheme="blue"
//           borderRadius="md"
//           display="flex"
//           alignItems="center"
//           gap={2}
//         >
//           {mostrarResposta ? "Ocultar Detalhes" : "Mostrar Detalhes"}
//           <Icon
//             as={mostrarResposta ? ChevronUpIcon : ChevronDownIcon}
//             w={5}
//             h={5}
//           />
//         </Button>
//         {mostrarResposta && renderResponseContent()}
//       </Flex>
//     </>
//   );
// }
