// 'use client'
// import { Select, SelectProps } from "@chakra-ui/react";
// import {useEffect, useState } from "react";

// export default function  SelectConstrutora({ ...props }: SelectProps) {
//   const [Data, setData] = useState<any>([]);
//   useEffect(() => {
//     (async () => {
//       const req = await fetch("/api/construtora/getall");
//       const res = await req.json();
//       setData(res);
//     })();
//   }, []);
//   return (
//     <>  
//       <Select
//         {...props}
//       >
//         <option value={0} >Selecione uma Construtora</option>
//         {Data.map((item: any) => (
//           <option key={item.id} value={item.id}>
//             {item.fantasia}
//           </option>
//         ))}
//       </Select>
//     </>
//   );
// }