// "use client";

// import Loading from "@/app/loading";
// import CpfMask from "@/components/cpf_mask";
// import VerificadorFileComponent from "@/components/file";
// import { Whatsapp } from "@/components/whatsapp";
// import { useSession } from "@/hook/useSession";
// import {
//   Alert,
//   AlertIcon,
//   Box,
//   Button,
//   chakra,
//   Flex,
//   FormControl,
//   FormLabel,
//   GridItem,
//   Input,
//   InputGroup,
//   SimpleGrid,
//   Stack,
//   Switch,
//   useToast,
// } from "@chakra-ui/react";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";

// import { mask, unMask } from "remask";
// interface RelacionadoProps {
//   SetValue: solictacao.SolicitacaoPost;
// }

// export default function RelacionadoForm({ SetValue }: RelacionadoProps) {
//   const [nome, setnome] = useState("");
//   const [cpf, setCpf] = useState("");
//   const [ConstrutoraID, setConstrutoraID] = useState(0);
//   const [FinanceiraID, setFinanceiraID] = useState(0);
//   const [empreendimento, setempreendimento] = useState(0);
//   const [email, setemail] = useState("");
//   const [tel, setTel] = useState<string>("");
//   const [teldois, SetTeldois] = useState<string>("");
//   const [Whatappdois, setWhatappdois] = useState<string>("");
//   const [DataNascimento, setDataNascimento] = useState<Date | string | any>();
//   const [Load, setLoad] = useState<boolean>(false);
//   const [Sms, setSms] = useState<boolean>(true);
//   const [UploadRgUrl, setUploadRgUrl] = useState<string>("");
//   const [UploadCnhUrl, setUploadCnhUrl] = useState<string>("");
//   const [Logwhats, setLogwhats] = useState<string>("");
//   const toast = useToast();
//   const router = useRouter();
//   const session = useSession();
//   const user = session;

//   useEffect(() => {
//     if (SetValue.cpfdois) {
//       setCpf(SetValue.cpfdois.replace(/\W+/g, ""));
//     }
//   }, [SetValue]);

//   const handlesubmit = () => {
//     if (SetValue.cpf.replace(/\W+/g, "") === cpf.replace(/\W+/g, "")) {
//       toast({
//         title: "Cpf Duplicado",
//         description: "O cpf do principal não pode ser igual ao do relacionado",
//         status: "error",
//         duration: 15000,
//         isClosable: true,
//         position: "top-right",
//       });
//     } else if (!nome || !email || !tel || !email || !DataNascimento) {
//       const capos = [];
//       if (!nome) {
//         capos.push("Nome");
//       }
//       if (!email) {
//         capos.push("Email");
//       }
//       if (!tel) {
//         capos.push("Telefone");
//       }
//       if (!DataNascimento) {
//         capos.push("Data de Nascimento");
//       }
//       toast({
//         title: "Preencha todos os campos",
//         description:
//           "os seguintes campos não foram preenchidos:" + capos.join(", "),
//         status: "error",
//         duration: 15000,
//         isClosable: true,
//         position: "top-right",
//       });
//     } else {
//       const dadossuperior: solictacao.SolicitacaoPost = {
//         url: window.location.origin,
//         nome: SetValue.nome.toUpperCase(),
//         telefone: SetValue.telefone.replace(/\W+/g, ""),
//         cpf: SetValue.cpf.replace(/\W+/g, ""),
//         telefone2: SetValue.telefone2.replace(/\W+/g, ""),
//         email: SetValue.email.replace(/\s+/g, "").toLowerCase(),
//         uploadRg: SetValue.uploadRg,
//         uploadCnh: SetValue.uploadCnh,
//         corretor: SetValue.corretor,
//         construtora: SetValue.construtora,
//         empreedimento: SetValue.empreedimento,
//         dt_nascimento: SetValue.dt_nascimento,
//         relacionamento: SetValue.relacionamento,
//         rela_quest: SetValue.rela_quest,
//         financeiro: SetValue.financeiro,
//         ...(SetValue.obs && { obs: SetValue.obs }),
//       };
//       const dados: solictacao.SolicitacaoPost = {
//         url: window.location.origin,
//         nome: nome.toUpperCase(),
//         telefone: tel.replace(/\W+/g, ""),
//         cpf: cpf.replace(/\W+/g, ""),
//         telefone2: teldois.replace(/\W+/g, ""),
//         email: email,
//         uploadRg: UploadRgUrl,
//         uploadCnh: UploadCnhUrl,
//         corretor: SetValue.corretor,
//         construtora: SetValue.construtora,
//         empreedimento: SetValue.empreedimento,
//         dt_nascimento: DataNascimento,
//         relacionamento: SetValue.cpf ? [SetValue.cpf] : [],
//         rela_quest: SetValue.rela_quest ? true : false,
//         financeiro: SetValue.financeiro,
//         ...(Logwhats && { obs: Logwhats }),
//       };

//       const data = [dados, dadossuperior];
//       setLoad(true);
//       data.map(async (item: any, index: number) => {
//         const verificador = await fetch(
//           `/api/consulta/cpf/${item.cpf.replace(/\W+/g, "")}`
//         );
//         const retorno = await verificador.json();
//         if (!verificador.ok) {
//           toast({
//             title: "Erro",
//             description: retorno.message,
//             status: "error",
//             duration: 3000,
//             isClosable: true,
//           });
//           setLoad(false);
//           return null;
//         } else {
//           const response = await fetch(
//             `/api/solicitacao?sms=${Sms}&vendedor=${SetValue.vendedorName}`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//               },
//               body: JSON.stringify(item),
//             }
//           );
//           if (response.ok) {
//             toast({
//               title: "Sucesso",
//               description: "Solicitações enviadas com sucesso",
//               status: "success",
//               duration: 3000,
//               isClosable: true,
//             });

//             if (data.length === index + 1) {
//               router.push("/home");
//               setLoad(false);
//             }
//           } else {
//             const retorno = await response.json();
//             const msg = `cliente ${item.nome} - ${retorno.message}`;
//             toast({
//               title: "Erro",
//               description: msg,
//               status: "error",
//               duration: 3000,
//               isClosable: true,
//             });
//             setLoad(false);
//             return null;
//           }
//         }
//       });
//     }
//   };

//   if (user?.empreendimento.length === 1 && !empreendimento) {
//     setempreendimento(user.empreendimento[0].id);
//   }

//   if (user?.construtora.length === 1 && !ConstrutoraID) {
//     setConstrutoraID(user.construtora[0].id);
//   }
//   if (user?.Financeira?.length === 1 && !FinanceiraID) {
//     setFinanceiraID(user.Financeira[0].id);
//   }

//   if (Load) {
//     return <Loading />;
//   }

//   const handleFileUploadedRg = (result: any) => {
//     setUploadRgUrl(result);
//   };
//   const handleFileUploadedCnh = (result: any) => {
//     setUploadCnhUrl(result);
//   };

//   const WhatsAppMask = (e: any) => {
//     const valor = e.target.value;
//     const valorLinpo = unMask(valor);
//     const masked = mask(valorLinpo, ["(99) 9999-9999", "(99) 9 9999-9999"]);
//     SetTeldois(unMask(masked));
//     setWhatappdois(masked);
//   };

//   return (
//     <Stack spacing={4} p={4} maxWidth="900px" mx="auto">
//       <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
//         <Box>
//           <FormLabel>CPF</FormLabel>
//           <CpfMask
//             desativado
//             setvalue={SetValue.cpfdois ? SetValue.cpfdois : cpf}
//             onvalue={setCpf}
//           />
//         </Box>
//         <Box>
//           <FormLabel>
//             Nome Completo{" "}
//             <chakra.p color={"red"} fontSize={"9px"}>
//               (Obrigatório)
//             </chakra.p>
//           </FormLabel>
//           <Input
//             type="text"
//             onChange={(e) => setnome(e.target.value.toUpperCase())}
//             value={nome}
//           />
//         </Box>
//       </SimpleGrid>

//       <SimpleGrid
//         columns={{ base: 1, md: 3 }}
//         spacing={6}
//         mt={6}
//         alignItems={"end"}
//       >
//         <Box>
//           <FormLabel>
//             Data de Nascimento
//             <chakra.p color={"red"} fontSize={"9px"}>
//               (Obrigatório)
//             </chakra.p>
//           </FormLabel>
//           <Input
//             type="date"
//             onChange={(e) => setDataNascimento(e.target.value)}
//             value={DataNascimento}
//           />
//         </Box>
//         <GridItem>
//           <FormLabel>
//             Whatsapp com DDD{" "}
//             <chakra.p color={"red"} fontSize={"9px"}>
//               (Obrigatório)
//             </chakra.p>
//           </FormLabel>
//           <Whatsapp setValue={tel} onValue={setTel} retornoLog={setLogwhats} />
//         </GridItem>
//         <GridItem>
//           <FormLabel>Whatsapp com DDD 2</FormLabel>
//           <Input type="text" onChange={WhatsAppMask} value={Whatappdois} />
//         </GridItem>
//       </SimpleGrid>
//       <SimpleGrid
//         columns={{ base: 1, md: 2 }}
//         spacing={6}
//         mt={6}
//         alignItems={"end"}
//       >
//         <GridItem colSpan={1}>
//           <FormLabel>
//             Email{" "}
//             <chakra.p color={"red"} fontSize={"9px"}>
//               (Obrigatório)
//             </chakra.p>
//           </FormLabel>
//           <InputGroup>
//             <Input
//               type="text"
//               border="1px solid #b8b8b8cc"
//               onChange={(e: any) =>
//                 setemail(e.target.value.replace(/\s+/g, "").toLowerCase())
//               }
//               value={email}
//             />
//           </InputGroup>
//         </GridItem>
//       </SimpleGrid>

//       <SimpleGrid columns={{ base: 1 }} spacing={6} mt={6}>
//         <Alert status="warning" variant="left-accent">
//           <AlertIcon />
//           Ao subir os arquivos, de preferencia a cnh exportado da app CNH
//           Digital ou foto da CNH totalmente aberta.
//         </Alert>
//       </SimpleGrid>

//       <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6} mt={6}>
//         <FormControl as={GridItem}>
//           <FormLabel>CNH</FormLabel>
//           <VerificadorFileComponent onFileUploaded={handleFileUploadedCnh} />
//         </FormControl>
//         <FormControl as={GridItem}>
//           <FormLabel>RG</FormLabel>
//           <VerificadorFileComponent onFileUploaded={handleFileUploadedRg} />
//         </FormControl>
//         {user?.hierarquia === "ADM" && (
//           <Box>
//             <FormLabel>Envio de SMS</FormLabel>
//             <Flex alignItems={"flex-start"}>
//               <Switch
//                 colorScheme="green"
//                 size="lg"
//                 onChange={(e) => setSms(e.target.checked)}
//                 isChecked={Sms}
//               />
//             </Flex>
//           </Box>
//         )}
//       </SimpleGrid>

//       <Button
//         mt={6}
//         variant="outline"
//         width="100%"
//         maxWidth="250px"
//         height="50px"
//         onClick={handlesubmit}
//       >
//         CRIAR CONTA
//       </Button>
//     </Stack>
//   );
// }
