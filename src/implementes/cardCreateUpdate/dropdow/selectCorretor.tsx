"use client";
import useUserCompraContext from "@/hook/useUserCompraContext";
import { Select, SelectProps } from "@chakra-ui/react";
import { useSession } from "@/hook/useSession";
import { useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

type SelectCorretorProps = SelectProps

export default function SelectCorretor({
  ...props
}: SelectCorretorProps) {
  const [Data, setData] = useState<any>([]);
  const [Loading, setLoading] = useState<boolean>(false);
  const session = useSession();
  const user = session;
  const hierarquia = user?.hierarquia;

  const { ContrutoraCX, EmpreedimentoCX, setCorretorCx } = useUserCompraContext();

  useEffect(() => {
    if (hierarquia === "ADM") {
        if (ContrutoraCX > 0) {
          setLoading(true);
        (async () => {
          const req = await fetch(
            `/api/usuario/search?construtora=${ContrutoraCX}&empreedimento=${EmpreedimentoCX}`
          );
          const res = await req.json();
          setData(res);

          setLoading(false);
        })();
      }
    }
  }, [ContrutoraCX, EmpreedimentoCX, hierarquia]);



  return (
    <>
      {Loading && <BeatLoader color="#36d7b7" />}
      {!Loading && (
        <Select
          {...props}
          name="corretor"
          placeholder="Selecione um Corretor"
          onChange={(e) => setCorretorCx(Number(e.target.value))}
        >
          {Data.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.nome}
            </option>
          ))}
        </Select>
      )}
    </>
  );
}
