import { Box, Input, useToast } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { mask, unMask } from "remask";
import { cpf } from "cpf-cnpj-validator";

interface CpfMaskProps {
  setvalue: string;
  onvalue: any;
  desativado?: boolean;
}

const CpfMask: React.FC<CpfMaskProps> = ({
  setvalue,
  onvalue,
  desativado = false
}) => {
  const [value, setValue] = useState("");
  // const [isInvalid, setIsInvalid] = useState(false);
  const [Disable, setDesativado] = useState(false);
  const toast = useToast(); // Hook para exibir toasts do Chakra UI

  useEffect(() => {
    setDesativado(desativado); // Define o estado de desativado
    handleMask(setvalue); // Atualiza a máscara quando o valor do CPF muda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setvalue, desativado]);

  const handleMask = (data: any) => {
    const valor = data;
    const valorLimpo = unMask(valor); // Remove a máscara para obter apenas os dígitos
    const masked = mask(valorLimpo, ["999.999.999-99"]); // Aplica a máscara de CPF
    setValue(masked); // Atualiza o valor exibido no input
  };

  return (
    <Box w="Full">
      <Input
        disabled={Disable}
        type="text"
        border={"1px solid #b8b8b8cc"}
        onChange={(e) => handleMask(e.target.value)}
        value={value}
        // borderColor={isInvalid ? "crimson" : undefined}
        placeholder="Digite o CPF"
        onBlur={(e) => {
          const valor = e.target.value;
          const valorLimpo = unMask(valor); // Remove a máscara para obter apenas os dígitos
          const chekCpf = cpf.isValid(valorLimpo);
          if (chekCpf) {
            onvalue(valorLimpo);
            toast({
              title: "CPF válido!",
              status: "success",
              duration: 2000,
              isClosable: true
            });
          } else {
            toast({
              title: "CPF inválido!",
              status: "error",
              duration: 2000,
              isClosable: true
            });
          }
        }}
      />
    </Box>
  );
};

export default CpfMask;
