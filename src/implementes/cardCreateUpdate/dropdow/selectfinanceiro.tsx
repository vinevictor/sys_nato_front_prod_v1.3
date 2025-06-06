"use client";
import useUserCompraContext from "@/hook/useUserCompraContext";
import { Select, SelectProps } from "@chakra-ui/react";
import { useSession } from "@/hook/useSession";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

type SelectEmpreedimentoProps = SelectProps

export default function SelectFinanceiro({
  ...props
}: SelectEmpreedimentoProps) {
  const [Data, setData] = useState<any>([]);
  const session = useSession();
  const user = session;
  const hierarquia = user?.hierarquia;

  const { EmpreedimentoCX, ContrutoraCX } = useUserCompraContext();

  useEffect(() => {
    if (hierarquia === "ADM") {
      (async () => {
        const req = await fetch("/api/financeira/getall");
        const res = await req.json();
        setData(res);
      })();
    } else {
      const data = user?.Financeira;
      setData(data);
    }
  }, [hierarquia, user?.Financeira]);

  return (
    <>
      {ContrutoraCX === 0 || EmpreedimentoCX === 0 && (
        <BeatLoader color="#36d7b7" />
      )}
      {ContrutoraCX > 0 && EmpreedimentoCX > 0 && (
        <Select
          {...props}
          name="financeiro"
          placeholder="Selecione uma empreendimento"
        >
          {Data.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.fantasia}
            </option>
          ))}
        </Select>
      )}
    </>
  );
}
