"use client";
import { Select, SelectProps } from "@chakra-ui/react";
import { BeatLoader } from "react-spinners";
import { useEffect, useState } from "react";

import useUserCompraContext from "@/hook/useUserCompraContext";
import { useSession } from "@/hook/useSession";

type Empreendimento = { id: number; nome: string };

export default function SelectEmpreendimento(props: SelectProps) {
  const { ContrutoraCX, setEmpreedimentoCX } = useUserCompraContext();
  const user = useSession();
  const hierarquia = user?.hierarquia;

  const [data, setData] = useState<Empreendimento[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    async function fetchEmpreendimentos() {
      setLoading(true);
      try {
        let lista: Empreendimento[] = [];

        if (hierarquia === "ADM") {
    
          const url =
            ContrutoraCX > 0
              ? `/api/empreendimento/getall/filter/${ContrutoraCX}`
              : `/api/empreendimento/getall`;
          const res = await fetch(url);
          lista = await res.json();
        } else if (user?.empreendimento) {
        
          lista = Array.isArray(user.empreendimento)
            ? user.empreendimento
            : [user.empreendimento];
        }

        if (!ignore) setData(lista);
      } catch (err) {
        console.error("Erro ao carregar empreendimentos:", err);
        if (!ignore) setData([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    fetchEmpreendimentos();
    return () => {
      ignore = true;
    };
  }, [hierarquia, ContrutoraCX, user?.empreendimento]);

  if (loading) return <BeatLoader color="#36d7b7" />;
  if (!data.length) return null; 

  return (
    <Select
      {...props}
      name="empreendimento"
      placeholder="Selecione um empreendimento"
      onChange={(e) => setEmpreedimentoCX(Number(e.target.value))}
    >
      {data.map((item) => (
        <option key={item.id} value={item.id}>
          {item.nome}
        </option>
      ))}
    </Select>
  );
}

