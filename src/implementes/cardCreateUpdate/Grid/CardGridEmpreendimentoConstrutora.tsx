import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import { SelectEmpreendimentoConstrutora } from "../dropdow/selectEmpreendimentoConstrutora";

interface CardGridEmpreendimentoConstrutoraProps extends BoxProps {
  EmpreendimentoConstrutora?: string | any;
}

/**
 * Componente de Grid para seleção de Construtora do Empreendimento
 *
 * Renderiza um campo de formulário com label e select de construtoras.
 * Suporta temas claro e escuro automaticamente.
 *
 * @param EmpreendimentoConstrutora - ID da construtora selecionada
 */
export function CardGridEmpreendimentoConstrutora({
  EmpreendimentoConstrutora,
  ...props
}: CardGridEmpreendimentoConstrutoraProps) {
  return (
    <Box {...props}>
      <FormLabel
        fontSize="sm"
        fontWeight="md"
        m={0}
        color="gray.700"
        _dark={{
          color: "gray.200",
        }}
      >
        Construtora
      </FormLabel>
      <SelectEmpreendimentoConstrutora setValue={EmpreendimentoConstrutora} />
    </Box>
  );
}

