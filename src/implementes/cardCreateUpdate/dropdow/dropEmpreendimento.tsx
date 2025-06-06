"use client";
import useUserCompraContext from "@/hook/useUserCompraContext";
import {
  Box,
  Button,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Select,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { BeatLoader } from "react-spinners";

interface DropEmpreendimentoProps {
  value: number;
  id: number;
  user: any;
}
export default function DropEmpreendimento({
  value,
  user,
  id,
}: DropEmpreendimentoProps) {
  const [Empreedimento, setEmpreedimento] = useState<number>(0);
  const [Loading, setLoading] = useState<boolean>(false);
  const [Load, setLoad] = useState<boolean>(false);
  const hierarquia = user.hierarquia;
  const [Data, setData] = useState<any>([]);
  const toast = useToast();
  const route = useRouter();

  const { ContrutoraCX, setEmpreedimentoCX } = useUserCompraContext();

  useEffect(() => {
    if (hierarquia === "ADM") {
      setLoad(true);
      if (ContrutoraCX) {
        (async () => {
          const req = await fetch(
            `/api/empreendimento/getall/filter/${ContrutoraCX}`
          );
          const res = await req.json();
          setData(res);
        })();
      } else {
        (async () => {
          const req = await fetch("/api/empreendimento/getall");
          const res = await req.json();
          setData(res);
        })();
      }

      setLoad(false);
    } else {
      const Empreedimento = user?.empreendimento;
      setData(Empreedimento);
    }

    if (value) {
      setEmpreedimento(value);
      setEmpreedimentoCX(value);
    }

  }, [ContrutoraCX, hierarquia, setEmpreedimentoCX, user?.empreendimento, value]);

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/solicitacao/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          empreedimento: Number(Empreedimento),
        }),
      });

      if (response.ok) {
        toast({
          title: "Empreendimento alterado com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setEmpreedimentoCX(Number(Empreedimento));
        setLoading(false);
        route.refresh();
      }
    } catch (error) {
      toast({
        title: "Erro ao alterar o empreendimento",
        description: JSON.stringify(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setLoading(false);
    }
  };

  return (
    <>
      {Loading || Load && <BeatLoader color="#36d7b7" />}
      {Data.length > 1 && (
        <Box>
          <Popover>
            <PopoverTrigger>
              <Button variant="link" colorScheme="gray">
                Alterar Empreendimento
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverArrow />
              <PopoverCloseButton />
              <PopoverHeader>Alterar Empreendimento</PopoverHeader>
              <PopoverBody display={"flex"} gap={3} alignItems={"center"}>
                <Select
                  size={"sm"}
                  borderRadius={"10px"}
                  placeholder="Selecione"
                  name="empreendimento"
                  value={Empreedimento}
                  onChange={(e) => setEmpreedimento(Number(e.target.value))}
                >
                  {Data.map((item: any) => (
                    <option key={item.id} value={Number(item.id)}>
                      {item.nome}
                    </option>
                  ))}
                </Select>
                <IconButton
                  icon={<FaPlus />}
                  aria-label={"substituir"}
                  colorScheme={"teal"}
                  size={"sm"}
                  onClick={handleUpdate}
                />
              </PopoverBody>
            </PopoverContent>
          </Popover>
        </Box>
      )}
    </>
  );
}
