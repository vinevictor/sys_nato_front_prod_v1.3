"use client";
import { Box, Input, InputProps, Text, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { mask } from "remask";

// Definindo o tipo para SetValue, ajuste conforme necessário para o tipo correto da sua aplicação
interface InputTel1Props extends InputProps {
  SetValue: string;
  index: number;
  readonly?: boolean;
}

export const InputTel2 = ({
  index,
  SetValue,
  readonly,
  ...props
}: InputTel1Props) => {
  const [tel1, setTel1] = useState<string>("");
  const [Verifique, setVerifique] = useState<boolean>(false);

  useEffect(() => {
    if (SetValue && !tel1) {
      const maskTel = mask(SetValue, ["(99) 9 9999-9999", "(99) 9999-9999"]);
      setTel1(maskTel); // Atribuindo o valor inicial do telefone
    }
  }, [SetValue, tel1]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target) {
      const value = e.target.value;
      const valorLimpo = value.replace(/[^0-9]/g, "");
      const MaskTel = mask(valorLimpo, ["(99) 9 9999-9999", "(99) 9999-9999"]);
      setTel1(MaskTel);
    }
  };

  const Whatsapp = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (index == 1) {
      const value = e.target.value;
      const valorLimpo = value.replace(/[^0-9]/g, "");
      const api = await fetch("/api/consulta/whatsapp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          telefone: valorLimpo
        })
      });
      const data = await api.json();
      if (data.data.exists) {
        setVerifique(false);
      } else {
        setVerifique(true);
      }
    }
  };

  return (
    <>
      {readonly ? (
        <Tooltip
          bg={"orange.400"}
          label="Para fazer alguma alteração, solicite abrindo um chamado!"
          rounded={"lg"}
        >
          <Input
            type="tel"
            placeholder="(__) _____-____"
            variant="flushed"
            value={tel1}
            onBlur={Whatsapp}
            readOnly
            {...props} // Spread dos props adicionais do Chakra UI
          />
        </Tooltip>
      ) : (
        <Input
          type="tel"
          placeholder="(__) _____-____"
          variant="flushed"
          value={tel1}
          onChange={handleChange}
          onBlur={Whatsapp}
          {...props} // Spread dos props adicionais do Chakra UI
        />
      )}

      {Verifique && (
        <Text color={"red"} fontSize={"xs"}>
          Número de telefone inválido
        </Text>
      )}
      <Box hidden>
        <Input
          type="tel"
          name={`telefones${index > 0 && index}`}
          value={tel1.replace(/\D+/g, "")}
          hidden
          readOnly
        />
      </Box>
    </>
  );
};
