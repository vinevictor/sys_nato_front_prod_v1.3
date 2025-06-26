"use client";
import {
  FormControl,
  FormLabel,
  Input,
  InputProps,
  Text,
  useToast,
  chakra,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { unMask, mask as remask } from "remask";
import { cpf } from "cpf-cnpj-validator";

interface MaskedInputProps extends InputProps {
  id: string;
  onvalue?: (value: string) => void;
  isCpf?: boolean;
  isWhatsapp?: boolean;
  value: string;
  Disable?: boolean;
  mask: string | string[];
  label: string;
  required?: boolean;
  boxWidth?: string;
  retornoLog?: (log: any) => void;
}

export default function MaskedInput({
  required = false,
  onvalue,
  Disable = false,
  mask,
  isCpf = false,
  isWhatsapp = false,
  value,
  id,
  label,
  retornoLog,
  boxWidth, // Extraída separadamente para evitar warning do React sobre prop não reconhecida
  ...props // Agora props não contém boxWidth, evitando que seja passada para o elemento DOM nativo
}: MaskedInputProps) {
  const [localValue, setLocalValue] = useState(value || "");
  const [isInvalidWhatsapp, setIsInvalidWhatsapp] = useState(false);
  const toast = useToast();
  const [isInvaldNumber, setIsInvaldNumber] = useState(false);

  useEffect(() => {
    const safeValue = value ?? "";
    setLocalValue(
      mask ? remask(safeValue, Array.isArray(mask) ? mask : [mask]) : safeValue
    );
  }, [value, mask]);

  const handleMask = (input: string) => {
    const clean = unMask(input);
    const masked = remask(clean, Array.isArray(mask) ? mask : [mask]);
    setLocalValue(masked);
    onvalue?.(clean);
  };

  const handleBlur = async () => {
    const clean = unMask(localValue);

    // CPF Validation
    if (isCpf) {
      const isValidCpf = cpf.isValid(clean);
      toast({
        title: isValidCpf ? "CPF válido!" : "CPF inválido!",
        status: isValidCpf ? "success" : "error",
        duration: 2000,
        isClosable: true,
      });
    }

    // WhatsApp Validation
    if (isWhatsapp) {
      if (!clean) {
        setIsInvaldNumber(false);
        setIsInvalidWhatsapp(false);
        return;
      } else if (clean.length < 10) {
        setIsInvaldNumber(true);
        setIsInvalidWhatsapp(false);
        return;
      }
      const check = await checkWhatsapp(clean);
      if (!check) {
        setIsInvalidWhatsapp(true);
        setIsInvaldNumber(false);
      } else {
        setIsInvalidWhatsapp(false);
        setIsInvaldNumber(false);
        onvalue?.(clean);
      }
    }
  };

  const checkWhatsapp = async (telefone: string): Promise<boolean> => {
    try {
      const bugCheck = await fetch(`/api/bug_report`);
      const Dados = await bugCheck.json();
      console.log("🚀 ~ checkWhatsapp ~ Dados:", Dados);
      if (Dados.length > 0) {
        return true;
      }

      const request = await fetch("/api/consulta/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ telefone }),
      });
      const data = await request.json();

      if (data?.data?.log && retornoLog) {
        retornoLog(data.data.log);
        return true;
      }

      return !!data?.data?.exists;
    } catch (error) {
      console.error("Erro na validação do WhatsApp:", error);
      return false;
    }
  };

  return (
    <FormControl w={boxWidth}>
      <FormLabel
        htmlFor={id}
        fontSize="sm"
        display="flex"
        alignItems="center"
        gap={1}
      >
        {label}
        {required && (
          <Text as="span" fontSize="xs" color="red">
            Obrigatório*
          </Text>
        )}
      </FormLabel>

      <Input
        {...props}
        id={id}
        isDisabled={Disable}
        border="1px solid #b8b8b8cc"
        onChange={(e) => handleMask(e.target.value)}
        value={localValue}
        onBlur={handleBlur}
      />

      {isInvalidWhatsapp && isWhatsapp ? (
        <chakra.span color="red" fontSize={"xs"} fontWeight="bold">
          Esse telefone não possui WhatsApp
        </chakra.span>
      ) : isInvaldNumber && isWhatsapp ? (
        <chakra.span color="red" fontSize={"xs"} fontWeight="bold">
          Numero Incorreto
        </chakra.span>
      ) : null}
    </FormControl>
  );
}
