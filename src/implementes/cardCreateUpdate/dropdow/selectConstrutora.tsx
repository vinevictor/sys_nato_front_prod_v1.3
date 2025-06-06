'use client';
import useUserCompraContext from "@/hook/useUserCompraContext";
import { Select, SelectProps } from "@chakra-ui/react";
import { useSession } from "@/hook/useSession";
import { useEffect, useState } from "react";

type DropConstrutoraProps = SelectProps


export default function SelectConstrutora({ ...props }: DropConstrutoraProps) {
    const [Data, setData] = useState<any>([]);
    const session = useSession();
    const user = session;
    const hierarquia  = user?.hierarquia;
    const { setContrutoraCX } = useUserCompraContext();

    useEffect(() => {
        if (hierarquia === "ADM") {
        (async () => {
            const req = await fetch("/api/construtora/getall");
            const res = await req.json();
            setData(res);
        })();
        } else {
            const construtora = user?.construtora
            setData(construtora);
        }
    }, [hierarquia, user?.construtora]);


    return (
      <>
        <Select
          {...props}
          name="construtora"
          placeholder="Selecione uma Construtora"
          onChange={(e) => setContrutoraCX(Number(e.target.value))}
          readOnly
        >
          {Data.map((item: any) => (
            <option key={item.id} value={item.id}>
              {item.fantasia}
            </option>
          ))}
        </Select>
      </>
    );
}