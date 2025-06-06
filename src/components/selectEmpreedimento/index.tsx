// "use client";
// import { Select, SelectProps } from "@chakra-ui/react";
// import { useEffect, useState } from "react";

// interface EmpreendimentoProps extends SelectProps {
//   constru: number;
// }

// export default function SelectEmpreedimento({
//   constru,
//   ...props
// }: EmpreendimentoProps) {
//   const [Data, setData] = useState<any>([]);
//   useEffect(() => {
//     if (constru !== 0) {
//       (async () => {
//         const req = await fetch(`/api/empreendimento/getall/filter/${constru}`);
//         const res = await req.json();
//         setData(res);
//       })();
//     }
//   }, [constru]);
//   return (
//     <>
//       <Select {...props}>
//         <option value={0}>Selecione um Empreedimento</option>
//         {Data.map((item: any) => (
//           <option key={item.id} value={item.id}>
//             {item.nome}
//           </option>
//         ))}
//       </Select>
//     </>
//   );
// }
