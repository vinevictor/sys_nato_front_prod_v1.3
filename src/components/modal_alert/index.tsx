// "use client";

// import {
//   Box,
//   Button,
//   Divider,
//   Modal,
//   ModalBody,
//   ModalCloseButton,
//   ModalContent,
//   ModalHeader,
//   ModalOverlay,
//   Stack,
//   useDisclosure
// } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import { BiSolidBellRing } from "react-icons/bi";
// import { AlertComponent } from "../alerts";

// export const ModalComponent = () => {
//   const { isOpen, onOpen, onClose } = useDisclosure();

//   const [alerts, setAlerts] = useState<AlertsType.AlertsProps[]>([]);
//   const [Requests, setRequests] = useState<boolean>(false);

//   const [showButton, setShowButton] = useState(false);
//   useEffect(() => {
//     if (!Requests) {
//       (async () => {
//         const request = await fetch("/api/alerts/geral");
//         if (request.ok) {
//           const response = await request.json();
//           setShowButton(true);
//           setAlerts(response);
//           setRequests(true);
//         }
//       })();
//     }
//   }, [Requests, alerts]);


//   const OverlayTwo = () => (
//     <ModalOverlay
//       bg="none"
//       backdropFilter="auto"
//       backdropInvert="80%"
//       // backdropBlur='2px'
//     />
//   );

//   return (
//     <>
//       {showButton && (
//         <Button
//           color={"#00713D"}
//           variant="transparent-with-icon"
//           boxSize={4}
//           leftIcon={<BiSolidBellRing />}
//           onClick={onOpen}
//         ></Button>
//       )}
//       <Modal isOpen={isOpen} onClose={onClose} isCentered size={"3xl"}>
//         <OverlayTwo />
//         <ModalOverlay />
//         <ModalContent>
//           <ModalHeader>Alertas</ModalHeader>
//           <ModalCloseButton />
//           <ModalBody>
//             <Divider borderColor={"#00713D"} pt={2} />
//             <Stack pt={10} pb={10}>
//               <Box>
//                 <Stack spacing={3}>
//                   {alerts.map((a) => (
//                     <AlertComponent
//                       key={a.id}
//                       DeleteAlertStatus={a.status}
//                       clientId={a.solicitacao_id}
//                       ID={a.id}
//                       msg={a.texto}
//                       titulo={a.titulo}
//                       status={a.tag}
//                     />
//                   ))}
//                 </Stack>
//               </Box>
//             </Stack>
//           </ModalBody>
//         </ModalContent>
//       </Modal>
//     </>
//   );
// };
