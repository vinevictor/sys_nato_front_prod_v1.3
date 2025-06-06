// "use client";

// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   Input,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalFooter,
//   ModalHeader,
//   ModalOverlay,
//   Select,
//   Textarea,
//   useDisclosure,
//   useToast,
// } from "@chakra-ui/react";
// import { useEffect, useState } from "react";

// interface ModallPropsFormuulario {
//   rota: any;
//   empreedimento?: number;
//   clienteId?: number;
//   PostName?: string;
//   CorretorName?: string;
//   CorretorId?: number;
//   atualizar: any;
// }

// export const ModalFormComponent = ({
//   rota,
//   empreedimento,
//   clienteId,
//   PostName,
//   CorretorName,
//   CorretorId,
//   atualizar,
// }: ModallPropsFormuulario) => {
//   const [Titulo, setTitulo] = useState("");
//   const [Descricao, setDescricao] = useState("");
//   const [IdEmpreedimento, setIdEmpreedimento] = useState<number>(0);
//   const [StatusAlert, setStatusAlert] = useState("");
//   const [Empreedimeto, setEmpreedimeto] = useState([]);
//   const toast = useToast();

//   const { isOpen, onOpen, onClose } = useDisclosure();

//   useEffect(() => {
//     (async () => {
//       if (rota === "geral") {
//         const request = await fetch("/api/empreendimento/getall");
//         if (request.ok) {
//           const response = await request.json();
//           setEmpreedimeto(response);
//         }
//       }
//     })();
//   }, [rota]);

//   const OverlayTwo = () => (
//     <ModalOverlay
//       bg="none"
//       backdropFilter="auto"
//       backdropInvert="80%"
//       // backdropBlur='2px'
//     />
//   );

//   /**
//    * Handles form submission and creates an alert.
//    *
//    * @param {Object} e - The event object.
//    * @param {Function} e.preventDefault - Prevents the default form submission behavior.
//    * @return {Promise<void>} - A promise that resolves when the alert is created.
//    */
//   const handleSubmit = async (e: { preventDefault: () => void }) => {
//     e.preventDefault();
//     try {
//       // Construct the alert data object based on the form inputs and selected route.
//       const data: AlertsType.AlertsProps =
//         rota === "geral"
//           ? {
//               tipo: rota.toUpperCase(), // Set the alert type to the uppercase value of the route.
//               empreendimento: IdEmpreedimento, // Set the empreendimento ID.
//               tag: "info", // Set the tag to "info".
//               texto: Descricao, // Set the texto to the value of Descricao.
//               titulo: `${
//                 Empreedimeto.filter((e: any) => e.id === IdEmpreedimento).map(
//                   (e: any) => e.nome
//                 )[0]
//               } - ${Titulo}`, // Set the title based on the selected empreendimento and Titulo.
//             }
//           : {
//               tipo: "CORRETOR", // Set the alert type to "CORRETOR".
//               corretor: CorretorId, // Set the corretor ID.
//               empreendimento: empreedimento, // Set the empreendimento ID.
//               solicitacao_id: clienteId, // Set the solicitacao_id.
//               tag: !StatusAlert ? "warning" : StatusAlert, // Set the tag based on the value of StatusAlert.
//               texto: Descricao, // Set the texto to the value of Descricao.
//               titulo: `${PostName?.split(" ")[0]} ${
//                 PostName?.split(" ")[1]
//               } - ${Titulo}`, // Set the title based on the PostName and Titulo.
//             };


//       // Send a POST request to the /api/alerts/create endpoint with the data object.
//       const request = await fetch(`/api/alerts/create`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       });

//       // If the request was successful, show a success toast message.
//       if (request.ok) {
//         toast({
//           title: "Sucesso!",
//           description: "Alerta criado com sucesso!",
//           status: "success",
//           duration: 3000,
//           isClosable: true,
//         });
//         // window.location.reload();
//         atualizar(1);
//         setTimeout(() => {
//           atualizar(0);
//         }, 100);
//       }

//       // Close the modal.
//       onClose();
//     } catch (error) {
//       console.error(error);
//       // If there was an error, show an error toast message.
//       toast({
//         title: "Erro!",
//         description: "Erro ao criar alerta!",
//         status: "error",
//         duration: 3000,
//         isClosable: true,
//       });
//     }
//   };

//   return (
//     <>
//       <Box
//         h={"100%"}
//         borderRadius={"15px"}
//         display={"flex"}
//         justifyContent={"center"}
//         alignItems={"center"}
//         gap={"20px"}
//       >
//         <Button
//           bg={"#00713D"}
//           textColor={"white"}
//           variant="solid"
//           _hover={{ bg: "#00631B" }}
//           size="md"
//           onClick={onOpen}
//         >
//           CRIAR ALERTA
//         </Button>
//       </Box>

//       <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
//         {OverlayTwo()}
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>
//             {PostName
//               ? "Criar Alerta para " + PostName + " vendedor " + CorretorName
//               : "Alerta Geral"}
//           </ModalHeader>
//           <ModalCloseButton />
//           <FormControl>
//             <ModalBody>
//               <FormLabel>Status</FormLabel>
//               <Select
//                 name="status"
//                 value={rota === "geral" ? "info" : StatusAlert}
//                 disabled={rota === "geral" ? true : false}
//                 onChange={(e) => setStatusAlert(e.target.value)}
//                 placeholder="Selecione o status"
//               >
//                 {rota == "geral" && <option value="info">Informação</option>}
//                 <option value="warning">Atenção</option>
//                 <option value="error">Erro</option>
//               </Select>

//               <FormControl id="title" isRequired mt={4}>
//                 <FormLabel>Título</FormLabel>
//                 <Input
//                   value={Titulo}
//                   onChange={(e) => setTitulo(e.target.value)}
//                   placeholder="Digite o título"
//                 />
//               </FormControl>

//               {rota === "geral" && (
//                 <FormControl id="idEmpreedimento" isRequired mt={4}>
//                   <FormLabel>Empreedimento</FormLabel>
//                   <Select
//                     name="idEmpreedimento"
//                     value={IdEmpreedimento}
//                     placeholder="Selecione o empreedimento"
//                     onChange={(e) => setIdEmpreedimento(Number(e.target.value))}
//                   >
//                     {Empreedimeto.length > 0 &&
//                       Empreedimeto.map((empreedimento: any) => (
//                         <option key={empreedimento.id} value={empreedimento.id}>
//                           {empreedimento.nome}
//                         </option>
//                       ))}
//                   </Select>
//                 </FormControl>
//               )}

//               <FormControl id="text" isRequired mt={4}>
//                 <FormLabel>Descrição</FormLabel>
//                 <Textarea
//                   value={Descricao}
//                   onChange={(e) => setDescricao(e.target.value)}
//                   placeholder="Digite o texto"
//                 />
//               </FormControl>
//             </ModalBody>

//             <ModalFooter>
//               <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
//                 Enviar
//               </Button>
//               <Button variant="ghost" onClick={onClose}>
//                 Cancelar
//               </Button>
//             </ModalFooter>
//           </FormControl>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };
