"use client";
import { IconsPadrão } from "@/data/icons";
import { Flex, Button, Tooltip, useBreakpointValue } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";

type BotaoAdmProps = {
  name: "Usuarios" | "Empreendimentos" | "Construtora" | "CCAs" | "Tags";
}

/**
 * Botão de navegação para o painel administrativo
 * @param name - Nome do botão
 * @returns Botão de navegação para o painel administrativo
 */
export default function BotaoAdm({ name }: BotaoAdmProps) {
  const router = useRouter();
  const pathname = usePathname();

  const padrão = IconsPadrão.find((icon) => icon.label === name);
  const path = padrão?.path;

  const isActive = path === pathname;

  // Determina se deve mostrar apenas ícone em telas muito pequenas
  const showIconOnly = useBreakpointValue({
    base: true,  // Telas muito pequenas: apenas ícone
    sm: false,   // Telas pequenas: texto + ícone
    md: false,   // Telas médias e grandes: texto + ícone
  });

  const buttonContent = (
    <Button
      bg={"white"}
      textColor={"green.500"}
      variant="ghost"
      _hover={{ bg: "green.600", textColor: "white", borderColor: "white" }}
      _active={{ bg: "green.600", textColor: "white", borderColor: "white" }}
      size={{ base: "sm", md: "md" }}
      isActive={isActive}
      leftIcon={showIconOnly ? undefined : padrão?.icon}
      w={{
        base: showIconOnly ? "40px" : "100%",
        sm: "100%",
        md: "100%"
      }}
      minW={{
        base: showIconOnly ? "40px" : "auto",
        sm: "auto",
        md: "auto"
      }}
      h={{
        base: "40px",
        sm: "44px",
        md: "48px"
      }}
      justifyContent="flex-start"
      px={{
        base: showIconOnly ? 0 : 3,
        sm: 4,
        md: 4
      }}
      onClick={() => router.push(path || '')}
    >
      {/* Em telas muito pequenas, mostra apenas o ícone centralizado */}
      {showIconOnly ? (
        <Flex justifyContent="center" alignItems="center" w="100%">
          {padrão?.icon}
        </Flex>
      ) : (
        // Em telas maiores, mostra o texto normalmente
        name
      )}
    </Button>
  );

  return (
    <Flex display={{ md: "flex" }} w="100%">
      {padrão && (
        showIconOnly ? (
          // Envolve com Tooltip quando mostra apenas ícone
          <Tooltip 
            label={name} 
            placement="right"
            hasArrow
          >
            {buttonContent}
          </Tooltip>
        ) : (
          buttonContent
        )
      )}
    </Flex>
  );
}