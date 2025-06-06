// /* eslint-disable react-hooks/exhaustive-deps */
// import { chakra, Input } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import { mask, unMask } from "remask";

// interface WhatsAppProps {
//   onValue: any;
//   setValue: string;
//   retornoLog: any;
// }

// export const Whatsapp = ({ onValue, setValue, retornoLog }: WhatsAppProps) => {
//   const [Tel, setTel] = useState("");
//   const [IsvalideTel, setIsvalideTel] = useState(false);

//   useEffect(() => {
//     if (setValue && !Tel) {
//       const valor: string = setValue;
//       const valorLinpo = unMask(valor);
//       const masked = mask(valorLinpo, ["(99) 9999-9999", "(99) 9 9999-9999"]);
//       const check = checkwhatsapp(unMask(masked));
//       if (!check) {
//         setIsvalideTel(true);
//       } else {
//         onValue(valor);
//         setIsvalideTel(false);
//       }
//       setTel(masked);
//     }
//   }, [Tel, onValue, setValue]);

//   const WhatsAppMask = (e: any) => {
//     const valor = e.target.value;
//     if (valor.length === 0) {
//       setIsvalideTel(false);
//     }
//     const valorLinpo = unMask(valor);
//     const masked = mask(valorLinpo, ["(99) 9999-9999", "(99) 9 9999-9999"]);
//     setTel(masked);
//   };

//   const checkwhatsapp = async (whatsapp: string): Promise<boolean> => {
//     const response = await fetch(`/api/bug_report`);
//     const Dados = await response.json();
//     if (Dados.length > 0) {
//       return true;
//     } else {
//       const request = await fetch("/api/consulta/whatsapp", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           telefone: whatsapp,
//         }),
//       });
//       const data = await request.json();
//       console.log("🚀 ~ checkwhatsapp ~ data:", data)
//       if(data.data.log){
//         retornoLog(data.data.log)
//         return true;
//       }
//       console.log("🚀 ~ checkwhatsapp ~ data:", data.data.exists)
//       if (!data.data.exists) {
//         return false;
//       }
//       return true;
//     }
//   };

//   return (
//     <>
//       <Input
//         type="text"
//         value={Tel}
//         onChange={WhatsAppMask}
//         onBlur={async (e) => {
//           const valor = unMask(e.target.value);
//           if (valor.length > 9) {
//             const check = await checkwhatsapp(valor);
//             if (!check) {
//               setIsvalideTel(true);
//             } else {
//               onValue(valor);
//               setIsvalideTel(false);
//             }
//           }
//         }}
//       />
//       {IsvalideTel && (
//         <chakra.span color="red" fontSize={"xs"} fontWeight="bold">
//           Esse telefone não tem whatsapp
//         </chakra.span>
//       )}
//     </>
//   );
// };
