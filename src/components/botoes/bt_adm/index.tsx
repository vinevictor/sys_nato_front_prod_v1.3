"use client";
import { IconsPadrão } from "@/data/icons";
import { Flex, Button } from "@chakra-ui/react";
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


  return (
    <Flex display={{ md: "flex" }}>
      {padrão && (
      <Button
        bg={"white"}
        textColor={"green.500"}
        variant="ghost"
        _hover={{ bg: "green.600", textColor: "white", borderColor: "white" }}
        _active={{ bg: "green.600", textColor: "white", borderColor: "white" }}
        size="md"
        isActive={isActive}
        leftIcon={padrão?.icon}
        w={"100%"}
        onClick={() => router.push(path || '')}
      >
        {name}
      </Button>
      )}
    </Flex>
  );
}
