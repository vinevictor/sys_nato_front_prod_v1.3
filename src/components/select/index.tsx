// "use client";
// import { Flex, Select } from "@chakra-ui/react";
// import { useEffect, useState } from "react";

// interface SelectProps {
//   SetValue?: any;
//   onValue: any;
//   hierarquia?: string;
//   tag: string;
//   DefaultValue?: number | null
// }

// export const SelectComponent = ({
//   SetValue,
//   onValue,
//   hierarquia,
//   tag,
//   DefaultValue
// }: SelectProps) => {
//   const [Valor, setValor] = useState(0);
//   const [Data, setData] = useState([]);

//   useEffect(() => {
//     if (DefaultValue) {
//       setValor(DefaultValue);
//     }
//     if (SetValue && Data.length < 1) {
//       console.log(Data);
//       setData(SetValue);
//       onValue(Number(SetValue));
//     }
//     if (hierarquia === "ADM" && Data.length < 1) {
//       (async () => {
//         if (tag === "empreendimento") {
//           const req = await fetch("/api/empreendimento/getall");
//           const res = await req.json();
//           setData(res);
//         } else if (tag === "construtora") {
//           const req = await fetch("/api/construtora/getall");
//           const res = await req.json();
//           setData(res);
//         } else if (tag === "corretor") {
//           const req = await fetch("/api/usuario/getall");
//           const res = await req.json();
//           setData(res);
//         } else if (tag === "Financeira") {
//           const req = await fetch("/api/financeira/getall");
//           const res = await req.json();
//           setData(res);
//         }
//       })();
//     }
//   }, [Data, DefaultValue, SetValue, hierarquia, onValue, tag]);

//   return (
//     <Flex w={"full"} py={"0.5rem"}>
//       <Select
//         onChange={(e) => {
//           onValue(Number(e.target.value));
//           setValor(Number(e.target.value));}}
//         placeholder={`Escolha ${
//           tag === "construtora" ? "uma construtora" : "um " + tag
//         }`}
//         value={Valor}
//       >
//         {Data.length > 0 &&
//           Data?.map((item: any) => {
//             return (
//               <option key={item.id} value={item.id}>
//                 {!item.nome ? item.fantasia : item.nome}
//               </option>
//             );
//           })}
//       </Select>
//     </Flex>
//   );
// };
