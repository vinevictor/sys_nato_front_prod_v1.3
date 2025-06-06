'use client';
import { IconButton } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

interface BotaoRetornoProps {
  rota: string;
}
export const BotaoRetorno = ({ rota }: BotaoRetornoProps) => {
  const route = useRouter();
  return (
    <>
      <IconButton
        variant="ghost"
        color={"black"}
        bg={"none"}
        border={"none"}
        _hover={{ bg: "none" }}
        onClick={() => route.push(`${rota}`)}
        aria-label="retornar"
        fontSize="20px"
        icon={<IoIosArrowBack />}
      />
    </>
  );
};
