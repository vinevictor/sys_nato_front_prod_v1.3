// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";

// import {
//   Box,
//   Button,
//   FormControl,
//   FormLabel,
//   GridItem,
//   Icon,
//   Input,
//   InputGroup,
//   chakra,
//   Select,
//   SimpleGrid,
//   Stack,
//   Tooltip,
//   useToast,
//   Flex,
//   Switch,
//   Alert,
//   AlertIcon
// } from "@chakra-ui/react";
// import { useSession } from "@/hook/useSession";
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Loading from "@/app/loading";
// import { mask, unMask } from "remask";
// import { Whatsapp } from "../whatsapp";
// import CpfMask from "../cpf_mask";
// import { SelectComponent } from "../select";
// import { SelectCorretor } from "../select_user";
// import VerificadorFileComponent from "../file";
// import { ModalConsultaRegistro } from "../modal_consulra_registro";

// interface relacionamentoProps {
//   onvalue: any;
//   ishidden: any;
// }

// export default function SolicitacaoForm({
//   onvalue,
//   ishidden
// }: relacionamentoProps) {
//   const [nome, setnome] = useState("");
//   const [cpf, setCpf] = useState("");
//   const [cpfdois, setCpfdois] = useState("");
//   const [ConstrutoraID, setConstrutoraID] = useState(0);
//   const [FinanceiraID, setFinanceiraID] = useState(0);
//   const [empreendimento, setempreendimento] = useState(0);
//   const [CorretorId, setCorretorId] = useState(0);
//   const [email, setemail] = useState("");
//   const [UploadCnhUrl, setUploadCnhUrl] = useState<string>("");
//   const [UploadRgUrl, setUploadRgUrl] = useState<string>("");
//   const [relacionamento, setrelacionamento] = useState<string>("nao");
//   const [tel, setTel] = useState<string>("");
//   const [teldois, SetTeldois] = useState<string>("");
//   const [DataNascimento, setDataNascimento] = useState<Date | string | any>();
//   const [Load, setLoad] = useState<boolean>(false);
//   const [Whatappdois, setWhatappdois] = useState<string>("");
//   const [VendedorName, setVendedorName] = useState<string>("");
//   const [Sms, setSms] = useState<boolean>(true);
//   const [Logwhats, setLogwhats] = useState<string>('');
//   const toast = useToast();
//   const router = useRouter();
//   const session = useSession();
//   const user = session;

//   const handlesubmit = async () => {
//     if (
//       !nome ||
//       !cpf ||
//       !email ||
//       !tel ||
//       ConstrutoraID === 0 ||
//       empreendimento === 0 ||
//       FinanceiraID === 0 ||
//       !email ||
//       !DataNascimento
//     ) {
//       const capos = [];
//       if (!nome) {
//         capos.push("Nome");
//       }
//       if (!cpf) {
//         capos.push("CPF");
//       }
//       if (!email) {
//         capos.push("Email");
//       }
//       if (!tel) {
//         capos.push("Telefone");
//       }
//       if (ConstrutoraID === 0) {
//         capos.push("Construtora");
//       }
//       if (empreendimento === 0) {
//         capos.push("Empreendimento");
//       }
//       if (FinanceiraID === 0) {
//         capos.push("Financeira");
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
//         position: "top-right"
//       });
//     } else {
//       const request = await fetch(
//         `/api/consulta/cpf/${cpf.replace(/\W+/g, "")}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json"
//           }
//         }
//       );
//       if (!request.ok) {
//         toast({
//           title: "Erro!",
//           description: "Erro ao verificar CPF!",
//           status: "error",
//           duration: 3000,
//           isClosable: true
//         });
//       }
//       const response = await request.json();
//       if (response.cpf) {
//         toast({
//           title: "CPF já cadastrado!",
//           description: response.message,
//           status: "warning",
//           duration: 3000,
//           isClosable: true
//         });
//       } else {
//         const data: any = {
//           url: window.location.origin,
//           nome: nome.toUpperCase(),
//           telefone: tel.replace(/\W+/g, ""),
//           cpf: cpf.replace(/\W+/g, ""),
//           telefone2: teldois.replace(/\W+/g, ""),
//           email: email.replace(/\s+/g, "").toLowerCase(),
//           uploadRg: UploadRgUrl,
//           uploadCnh: UploadCnhUrl,
//           corretor: user?.hierarquia === "ADM" ? CorretorId : Number(user?.id),
//           construtora: Number(ConstrutoraID),
//           empreedimento: Number(empreendimento),
//           dt_nascimento: DataNascimento,
//           relacionamento: cpfdois && relacionamento === "sim" ? [cpfdois] : [],
//           rela_quest: relacionamento === "sim" ? true : false,
//           financeiro: Number(FinanceiraID),
//           ...(Logwhats && {obs: Logwhats})
//         };

//         try {
//           setLoad(true);
//           const response = await fetch(
//             `/api/solicitacao?sms=${Sms}&vendedor=${VendedorName}`,
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json"
//               },
//               body: JSON.stringify(data)
//             }
//           );
//           const retorno = await response.json();
//           if (response.ok) {
//             toast({
//               title: "Sucesso",
//               description: "Solicitacao enviada com sucesso",
//               status: "success",
//               duration: 3000,
//               isClosable: true
//             });
//             setLoad(false);
//             router.push("/home");
//           } else {
//             toast({
//               title: "Erro",
//               description: retorno.message[1],
//               status: "error",
//               duration: 3000,
//               isClosable: true
//             });
//             setLoad(false);
//           }
//         } catch (error) {
//           console.log("🚀 ~ form_solicitacao/relacionamento ~ error:", error);
//           toast({
//             title: "Erro",
//             description: "Erro ao enviar solicitacao",
//             status: "error",
//             duration: 3000,
//             isClosable: true
//           });
//           setLoad(false);
//         }
//       }
//     }
//   };

//   // Corrigido: atualização de estados com useEffect para evitar loop infinito
//   useEffect(() => {
//     if (user?.empreendimento.length === 1 && !empreendimento) {
//       setempreendimento(user.empreendimento[0].id);
//     }
//   }, [user, empreendimento]);

//   useEffect(() => {
//     if (user?.construtora.length === 1 && !ConstrutoraID) {
//       setConstrutoraID(user.construtora[0].id);
//     }
//   }, [user, ConstrutoraID]);

//   useEffect(() => {
//     if (user?.Financeira?.length === 1 && !FinanceiraID) {
//       setFinanceiraID(user.Financeira[0].id);
//     }
//   }, [user, FinanceiraID]);

//   const handleCpfChange = (cpf: string) => {
//     setCpf(cpf);
//   };

//   const checkCpf = async (cpf: string) => {
//     const request = await fetch(
//       `/api/consulta/cpf/${cpf.replace(/\W+/g, "")}`,
//       {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json"
//         }
//       }
//     );

//     if (request.ok) {
//       const response = await request.json();

//       if (response.cpf) {
//         return true;
//       } else {
//         return false;
//       }
//     }
//     return false;
//   };

//   useEffect(() => {
//     (async () => {
//       if (relacionamento === "sim" && cpfdois.length === 11) {
//         const check = await checkCpf(cpfdois);
//         if(cpf === cpfdois){
//           toast({
//             title: "Os CPFs nao podem ser iguais!",
//             status: "warning",
//             duration: 3000,
//             isClosable: true
//           });
//         }
//         if (check) {
//           toast({
//             title: "CPF já cadastrado!",
//             status: "error",
//             duration: 3000,
//             position: "top-right",
//             isClosable: true
//           });
//         }
//         if (
//           !nome ||
//           !cpf ||
//           !email ||
//           !tel ||
//           ConstrutoraID === 0 ||
//           empreendimento === 0 ||
//           FinanceiraID === 0 ||
//           !email ||
//           !DataNascimento
//         ) {
//           const capos = [];
//           if (!nome) {
//             capos.push("Nome");
//           }
//           if (!cpf) {
//             capos.push("CPF");
//           }
//           if (!email) {
//             capos.push("Email");
//           }
//           if (!tel) {
//             capos.push("Telefone");
//           }
//           if (ConstrutoraID === 0) {
//             capos.push("Construtora");
//           }
//           if (empreendimento === 0) {
//             capos.push("Empreendimento");
//           }
//           if (FinanceiraID === 0) {
//             capos.push("Financeira");
//           }
//           if (!DataNascimento) {
//             capos.push("Data de Nascimento");
//           }
//           toast({
//             title: "Preencha todos os campos",
//             description:
//               "os seguintes campos não foram preenchidos:" + capos.join(", "),
//             status: "error",
//             duration: 15000,
//             isClosable: true,
//             position: "top-right"
//           });
//         } else {
//           ishidden("sim");
//           const data: solictacao.SolicitacaoPost = {
//             url: window.location.origin,
//             nome: nome.toUpperCase(),
//             cpf: cpf.replace(/\W+/g, ""),
//             telefone: tel.replace(/\W+/g, ""),
//             telefone2: teldois,
//             dt_nascimento: DataNascimento,
//             email: email.replace(/\s+/g, "").toLowerCase(),
//             uploadRg: UploadRgUrl,
//             uploadCnh: UploadCnhUrl,
//             corretor:
//               user?.hierarquia === "ADM" ? CorretorId : Number(user?.id),
//             relacionamento: [cpfdois],
//             cpfdois: cpfdois,
//             construtora: Number(ConstrutoraID),
//             empreedimento: Number(empreendimento),
//             financeiro: Number(FinanceiraID),
//             rela_quest: relacionamento === "sim" ? true : false,
//             vendedorName: VendedorName,
//             ...(Logwhats && {obs: Logwhats})
//           };
//           onvalue(data);
//         }
//       }

//       if (relacionamento === "nao" || cpfdois.length < 11) {
//         ishidden("nao");
//       }
//     })();
//   }, [ConstrutoraID, CorretorId, DataNascimento, FinanceiraID, Logwhats, UploadCnhUrl, UploadRgUrl, VendedorName, cpf, cpfdois, email, empreendimento, ishidden, nome, onvalue, relacionamento, tel, teldois, toast, user?.hierarquia, user?.id]);

//   if (Load) {
//     return <Loading />;
//   }

//   const WhatsAppMask = (e: any) => {
//     const valor = e.target.value;
//     const valorLinpo = unMask(valor);
//     const masked = mask(valorLinpo, ["(99) 9999-9999", "(99) 9 9999-9999"]);
//     SetTeldois(unMask(masked));
//     setWhatappdois(masked);
//   };

//   const handleFileUploadedRg = (result: any) => {
//     setUploadRgUrl(result);
//   };
//   const handleFileUploadedCnh = (result: any) => {
//     setUploadCnhUrl(result);
//   };

//   return (
//     <Stack spacing={4} p={4} maxWidth="900px" mx="auto">
//       <SimpleGrid columns={{ base: 1, md: 2, lg: 2 }} spacing={6}>
//         <Box>
//           <FormLabel>CPF</FormLabel>
//           <CpfMask desativado setvalue={cpf} onvalue={setCpf} />
//         </Box>
//         <Box>
//           <FormLabel>
//             <Flex alignItems={"flex-start"}>
//               Nome Completo{" "}
//               <chakra.p color={"red"} fontSize={"9px"}>
//                 (Obrigatório)
//               </chakra.p>
//             </Flex>
//           </FormLabel>
//           <Input
//             type="text"
//             onChange={(e) => setnome(e.target.value.toUpperCase())}
//             value={nome}
//           />
//         </Box>
//       </SimpleGrid>

//       <ModalConsultaRegistro setCpfChange={cpf} onCpfChange={handleCpfChange} />

//       <SimpleGrid
//         columns={{ base: 1, md: 2, lg: 3 }}
//         spacing={6}
//         mt={6}
//         alignItems={"end"}
//       >
//         <GridItem>
//           <FormLabel>
//             <Flex alignItems={"flex-start"}>
//               Data de Nascimento{" "}
//               <chakra.p color={"red"} fontSize={"9px"}>
//                 (Obrigatório)
//               </chakra.p>
//             </Flex>
//           </FormLabel>
//           <Input
//             type="date"
//             onChange={(e) => setDataNascimento(e.target.value)}
//             value={DataNascimento}
//           />
//         </GridItem>
//         <GridItem>
//           <FormLabel>
//             <Flex alignItems={"flex-start"}>
//               Whatsapp com DDD{" "}
//               <chakra.p color={"red"} fontSize={"9px"}>
//                 (Obrigatório)
//               </chakra.p>
//             </Flex>
//           </FormLabel>
//           <Whatsapp setValue={tel} onValue={setTel}  retornoLog={setLogwhats}/>
//         </GridItem>
//         <GridItem>
//           <FormLabel>Whatsapp com DDD 2</FormLabel>
//           <Input type="text" onChange={WhatsAppMask} value={Whatappdois} />
//         </GridItem>
//       </SimpleGrid>

//       <SimpleGrid
//         columns={{ base: 1, md: 2, lg: 2 }}
//         spacing={6}
//         mt={6}
//         alignItems={"end"}
//       >
//         <GridItem colSpan={{ base: 1, md: 1, lg: 1 }}>
//           <FormLabel>
//             <Flex alignItems={"flex-start"}>
//               Email{" "}
//               <chakra.p color={"red"} fontSize={"9px"}>
//                 (Obrigatório)
//               </chakra.p>
//             </Flex>
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

//       <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6} mt={6}>
//         {user?.construtora && (
//           <Box>
//             <FormLabel>Construtora</FormLabel>
//             <SelectComponent
//               hierarquia={user.hierarquia}
//               tag="construtora"
//               SetValue={user.construtora.map((item: any) => ({
//                 id: item.id,
//                 nome: item.fantasia
//               }))}
//               onValue={(e: any) => setConstrutoraID(e)}
//               DefaultValue={Number(ConstrutoraID)}
//             />
//           </Box>
//         )}
//         {user?.Financeira && (
//           <Box>
//             <FormLabel>Financeira</FormLabel>
//             <SelectComponent
//               hierarquia={user.hierarquia}
//               tag="Financeira"
//               SetValue={user.Financeira}
//               onValue={(e: any) => setFinanceiraID(e)}
//               DefaultValue={Number(FinanceiraID)}
//             />
//           </Box>
//         )}
//         {user?.empreendimento && (
//           <Box>
//             <FormLabel>Empreendimento</FormLabel>
//             <SelectComponent
//               hierarquia={user.hierarquia}
//               tag="empreendimento"
//               SetValue={user.empreendimento}
//               onValue={(e: any) => setempreendimento(e)}
//               DefaultValue={Number(empreendimento)}
//             />
//           </Box>
//         )}
//         {user?.hierarquia === "ADM" && (
//           <Box>
//             <FormLabel>Corretor</FormLabel>
//             <SelectCorretor
//               idcorretor={setCorretorId}
//               setCorretor={Number(CorretorId)}
//               Vendedor={setVendedorName}
//             />
//           </Box>
//         )}
//         {user?.hierarquia === "CONST" && (
//           <Box>
//             <FormLabel>Corretor</FormLabel>
//             <SelectCorretor
//               idcorretor={setCorretorId}
//               setCorretor={Number(CorretorId)}
//               Vendedor={setVendedorName}
//             />
//           </Box>
//         )}
//         {user?.hierarquia === "GRT" && (
//           <Box>
//             <FormLabel>Corretor</FormLabel>
//             <SelectCorretor
//               idcorretor={setCorretorId}
//               setCorretor={Number(CorretorId)}
//               Vendedor={setVendedorName}
//             />
//           </Box>
//         )}
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
//       </SimpleGrid>

//       <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6} mt={6}>
//         <Box>
//           <FormLabel>
//             Relacionamento
//             <Tooltip
//               label="Preencha este campo caso o Contrato contenha mais de um proprietário"
//               aria-label="A tooltip"
//             >
//               <Icon ml={2} color="black" cursor="pointer" boxSize={3} />
//             </Tooltip>
//           </FormLabel>
//           <Select
//             onChange={(e) => setrelacionamento(e.target.value)}
//             value={relacionamento}
//           >
//             <option value="sim">Sim</option>
//             <option value="nao">Não</option>
//           </Select>
//         </Box>

//         {relacionamento === "sim" && (
//           <Box>
//             <FormLabel>
//               <Flex alignItems={"flex-start"}>
//                 CPF do relacionado{" "}
//                 <chakra.p color={"red"} fontSize={"9px"}>
//                   (Obrigatório)
//                 </chakra.p>
//               </Flex>
//             </FormLabel>
//             <CpfMask setvalue={cpfdois} onvalue={setCpfdois} />
//           </Box>
//         )}

//         {/* {user?.hierarquia === "ADM" && (
//           <Box>
//             <FormLabel>
//               Voucher
//               <Tooltip
//                 label="Voucher para Atendimento em qualquer unidade Soluti"
//                 aria-label="A tooltip"
//               >
//                 <Icon ml={1} color="black" cursor="pointer" boxSize={3} />
//               </Tooltip>
//             </FormLabel>
//             <Input
//               type="text"
//               onChange={(e) => setVoucher(e.target.value)}
//               value={Voucher}
//             />
//           </Box>
//         )} */}

//         {user?.hierarquia === "ADM" && relacionamento !== "sim" && (
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
//         hidden={relacionamento === "sim"}
//       >
//         CRIAR CONTA
//       </Button>
//     </Stack>
//   );
// }
