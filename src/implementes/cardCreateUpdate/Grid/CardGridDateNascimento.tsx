"use client";
import { Box, BoxProps, FormLabel, Input, Tooltip } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface CardGridDateNascimento extends BoxProps {
  DataSolicitacao: solictacao.SolicitacaoGetType;
  readonly?: boolean;
}

export default function CardGridDateNascimento({
  DataSolicitacao,
  readonly,
  ...props
}: CardGridDateNascimento) {
  const [Date, setDate] = useState<string>("");

  useEffect(() => {
    if (DataSolicitacao?.dt_nascimento) {
      setDate(DataSolicitacao?.dt_nascimento.split("T")[0]);
    }
  }, [DataSolicitacao]);

  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Data de Nascimento
        </FormLabel>
        {readonly ? (
          <Tooltip
            bg={"orange.400"}
            label="Para fazer alguma alteração, solicite abrindo um chamado!"
            rounded={"lg"}
          >
            <Input
              type="date"
              name="DataNascimento"
              variant="flushed"
              value={Date}
              px={1}
              bg={"gray.100"}
              borderColor={"gray.400"}
              readOnly
            />
          </Tooltip>
        ) : (
          <Input
            type="date"
            name="DataNascimento"
            variant="flushed"
            value={Date}
            onChange={(e) => setDate(e.target.value)}
            px={1}
            bg={"gray.100"}
            borderColor={"gray.400"}
          />
        )}
      </Box>
    </>
  );
}
