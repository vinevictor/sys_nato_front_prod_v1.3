// "use client";

// import { Select } from "@chakra-ui/react";
// import { useSession } from "@/hook/useSession";
// import { useEffect, useState } from "react";

// interface SelectProps {
//   idcorretor: any;
//   setCorretor?: number | null;
//   Vendedor?: string | any;
// }

// export const SelectCorretor = ({
//   idcorretor,
//   setCorretor,
//   Vendedor,
// }: SelectProps) => {
//   // Estado inicializado como array vazio para evitar erros ao usar .map
// const [Data, setData] = useState<any[]>([]);
//   const [id, setId] = useState(0);
//   const session = useSession();
//   const user = session;

//   useEffect(() => {
//     if (setCorretor) {
//       setId(setCorretor);
//     }
//     (async () => {
//       const resq = await fetch(`/api/usuario/getall`);
//       const data = await resq.json();
//       // Garante que data é um array antes de filtrar
//       const safeData = Array.isArray(data) ? data : [];
//       const Result = user?.hierarquia === "GRT" ? safeData.filter((item: any) => {
//         const ConstruraGRT = user.construtora.map((construtora: any) => construtora.id);
//         for (let i = 0; i < item.construtora.length; i++) {
//           if (ConstruraGRT.includes(item.construtora[i].id)) {
//             return item;
//           }
//         }
//       }) : safeData;
//       setData(Result);
//     })();
//   }, [setCorretor, user?.construtora, user?.hierarquia]);

//   return (
//     <>
//       <Select
//         onChange={(e) => {
//           idcorretor(Number(e.target.value));
//           setId(Number(e.target.value));
//           // Garante que Data é array antes de usar .map e .filter
//           if (Array.isArray(Data)) {
//             Vendedor(
//               Data.filter((item: any) => item.id === Number(e.target.value)).map(
//                 (item: any) => item.nome
//               )[0]
//             );
//           } else {
//             Vendedor("");
//           }
//         }}
//         placeholder="Selecione um corretor"
//         value={id}
//       >
//         {Array.isArray(Data) &&
//           Data.map((item: any) => (
//             <option key={item.id} value={item.id}>
//               {item.nome}
//             </option>
//           ))}
//       </Select>
//     </>
//   );
// };
