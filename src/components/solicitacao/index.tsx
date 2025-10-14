"use client";
import { Box, Flex, useColorModeValue } from "@chakra-ui/react";
import ModalConsultaRegistro from "@/components/modal-consulta-cpf";
import FormSolicitacao from "@/components/form/solicitacao";
import { useState } from "react";
import { Session } from "@/types/session";

/**
 * Interface para props do componente
 */
interface switchProps {
  session: Session.SessionServer;
}

/**
 * Componente Switch de Solicitação
 * 
 * Funcionalidades:
 * - Gerencia estado do CPF e solicitação
 * - Controla exibição do modal e formulário
 * - Layout responsivo e adaptativo
 * 
 * @component
 */
export default function SolicitacaoSWITCH({ session }: switchProps) {
  const [cpfChange, setCpfChange] = useState<string>("");
  const [solicitacao, setSolicitacao] = useState<any>(null);

  // Cores dinâmicas baseadas no tema
  const bgForm = useColorModeValue("white", "gray.800");

  const onCpfChange = (cpf: string) => {
    setCpfChange(cpf);
  };

  const handleClose = () => {
    setCpfChange("");
    setSolicitacao(null);
  };

  return (
    <Box w="full" h="full">
      {/* Modal de Consulta de CPF */}
      <ModalConsultaRegistro
        onIsOpen={handleClose}
        setCpfChange={cpfChange}
        onCpfChange={onCpfChange}
        onSolicitacao={setSolicitacao}
      />
      
      {/* Formulário de Solicitação */}
      {cpfChange && (
        <Flex 
          w="full" 
          h="full" 
          justifyContent="center"
          alignItems="flex-start"
          p={{ base: 2, md: 4 }}
        >
          <Box
            w="full"
            maxW="1400px"
            bg={bgForm}
            borderRadius="xl"
            shadow="lg"
            p={{ base: 4, md: 6, lg: 8 }}
            border="1px"
            borderColor="gray.200"
            _dark={{ borderColor: "gray.700" }}
          >
            <FormSolicitacao
              cpf={cpfChange}
              solicitacao={solicitacao}
              session={session}
            />
          </Box>
        </Flex>
      )}
    </Box>
  );
}
