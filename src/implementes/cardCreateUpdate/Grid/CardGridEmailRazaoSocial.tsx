import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import React from "react";
import InputEmailRazaoSocial from "../imputs/inputEmailRazaoSocial";

interface CardGridEmailRazaoSocialProps extends BoxProps {
  DataSolicitacao?: solictacao.SolicitacaoGetType | any; 
  type?: string;
}

/**
 * CardGridEmailRazaoSocial component renders a form input for email or confirmation email
 * based on the provided type. It uses Chakra UI components for styling.
 *
 * @param {Object} props - The properties object.
 * @param {string} props.DataSolicitacao - The data object containing the email value.
 * @param {string} props.type - The type of the email input, either "confirm" for confirmation email or default for regular email.
 * @param {Object} props.rest - Additional properties passed to the Box component.
 *
 * @returns {JSX.Element} The rendered CardGridEmailRazaoSocial component.
 */
export default function CardGridEmailRazaoSocial({
  DataSolicitacao,
  type,
  ...props
}: CardGridEmailRazaoSocialProps) {
  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          {type === "confirm" ? "Confirmar Email" : "Email"}
        </FormLabel>
        <InputEmailRazaoSocial
          setValueEmail={DataSolicitacao?.email ?? ''} // Define um valor padrão vazio se o email for indefinido
          name={type === "confirm" ? "confirmEmail" : "email"}
          variant="flushed"
          px={1}
          bg={"gray.100"}
          borderColor={"gray.400"}
        />
      </Box>
    </>
  );
}
