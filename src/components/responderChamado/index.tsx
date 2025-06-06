// "use client";
// import {
//   Box,
//   Button,
//   Flex,
//   FormControl,
//   FormLabel,
//   Input,
//   Text,
//   Textarea,
//   Tooltip,
//   Image,
//   useBreakpointValue,
//   useToast,
// } from "@chakra-ui/react";
// import React, { useState } from "react";
// import BotaoChamadoNivelDois from "../botoes/btn_chamado_nivel_dois";

// interface ResponderChamadoProps {
//   chamadoId: number;
//   userId: number;
//   status: number;
// }

// export default function ResponderChamado({
//   chamadoId,
//   userId,
//   status,
// }: ResponderChamadoProps) {
//   const [resposta, setResposta] = useState<string>("");
//   const [files, setFiles] = useState<File[]>([]);
//   const [imagePreviews, setImagePreviews] = useState<string[]>([]);

//   const [fileName, setFileName] = useState<string[]>([]);

//   const toast = useToast();

//   const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//   };

//   const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
//     event.preventDefault();
//     const droppedFiles = event.dataTransfer.files;
//     handleFiles(droppedFiles);
//   };

//   const handleFiles = (uploadedFiles: FileList) => {
//     const filesArray = Array.from(uploadedFiles);

//     const newImagePreviews = filesArray
//       .filter((file) => file.type.startsWith("image/"))
//       .map((file) => URL.createObjectURL(file));

//     setFiles((prevFiles) => [...prevFiles, ...filesArray]);
//     setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
//   };

//   const handleRemove = (index: number, event: React.MouseEvent) => {
//     event.stopPropagation();
//     const name = fileName[index];
//     const newFilesNames = fileName.filter((_, i) => i !== index);
//     setFileName(newFilesNames);
//     const newFiles = files.filter((_, i) => i !== index);
//     const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
//     setFiles(newFiles);
//     setImagePreviews(newImagePreviews);
//   };

//   const handleEnviarResposta = async () => {
//     if (!chamadoId) {
//       toast({
//         title: "Erro",
//         description: "Chamado não identificado.",
//         status: "error",
//         duration: 9000,
//         isClosable: true,
//       });
//       return;
//     }

//     const formData = new FormData();

//     files.forEach((file) => {
//       formData.append("files", file);
//     });

//     formData.append("id", String(chamadoId));
//     formData.append("idResposta", String(userId));
//     formData.append("status", "3");

//     if (resposta) {
//       formData.append("resposta", resposta);
//     }

//     try {
//       const response = await fetch("/api/chamado/back/put", {
//         method: "PATCH",
//         body: formData,
//       });

//       if (response.ok) {
//         toast({
//           title: "Sucesso",
//           description: `Resposta enviada com sucesso para o chamado ID: ${chamadoId}`,
//           status: "success",
//           duration: 9000,
//           isClosable: true,
//         });
//         window.location.reload();
//       } else {
//         const errorMsg = await response.text();
//         toast({
//           title: "Erro",
//           description: `Erro ao enviar resposta: ${errorMsg}`,
//           status: "error",
//           duration: 9000,
//           isClosable: true,
//         });
//       }
//     } catch (error) {
//       console.error("Erro ao enviar resposta:", error);
//       toast({
//         title: "Erro",
//         description: "Ocorreu um erro inesperado ao enviar a resposta.",
//         status: "error",
//         duration: 9000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <Flex
//       direction="column"
//       p={8}
//       borderWidth={1}
//       borderRadius="lg"
//       shadow="lg"
//       bg="white"
//       gap={6}
//       w="100%"
//       maxWidth="800px"
//       mx="auto"
//       h={"100%"}
//     >
//       <FormControl>
//         <FormLabel>Resposta</FormLabel>
//         <Textarea
//           placeholder="Digite sua resposta aqui..."
//           value={resposta}
//           onChange={(e) => setResposta(e.target.value)}
//           resize="none"
//         />
//       </FormControl>

//       <Text fontWeight="semibold">Anexar Arquivos</Text>
//       <Box
//         onDragOver={handleDragOver}
//         onDrop={handleDrop}
//         p={5}
//         border="2px dashed"
//         borderColor="gray.300"
//         borderRadius="lg"
//         cursor="pointer"
//         onClick={() => document.getElementById("file-input")?.click()}
//         _hover={{ borderColor: "gray.500" }}
//       >
//         <Input
//           id="file-input"
//           type="file"
//           multiple
//           onChange={(e) => e.target.files && handleFiles(e.target.files)}
//           display="none"
//         />
//         <Text fontSize={useBreakpointValue({ base: "sm", md: "md" })}>
//           Arraste ou clique para selecionar arquivos.
//         </Text>
//       </Box>

//       <Box display="flex" flexWrap="wrap" justifyContent="center" mt={4}>
//         {imagePreviews.map((preview, index) => (
//           <Box key={index} position="relative" mr={2} mb={2}>
//             <Tooltip label="Excluir" placement="top" hasArrow>
//               <Button
//                 size="xs"
//                 colorScheme="red"
//                 onClick={(event) => handleRemove(index, event)}
//                 position="absolute"
//                 top={1}
//                 right={1}
//                 zIndex={1}
//               >
//                 x
//               </Button>
//             </Tooltip>
//             <Image
//               src={preview}
//               alt={`Preview ${index}`}
//               boxSize="100px"
//               objectFit="cover"
//               borderRadius="md"
//               transition="transform 0.2s"
//             />
//           </Box>
//         ))}
//       </Box>

//       <Flex gap={3} justify="flex-end">
//         <BotaoChamadoNivelDois id={chamadoId} status={status} />
//         <Button colorScheme="green" size={"sm"} onClick={handleEnviarResposta}>
//           Enviar Resposta
//         </Button>
//       </Flex>
//     </Flex>
//   );
// }
