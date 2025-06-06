import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { TbDatabaseDollar } from "react-icons/tb";

export default function BotaoPainelFinanceiro() {
  const router = useRouter();

  return (
    <Button
      textColor={"white"}
      variant="link"
      size="sm"
      leftIcon={<TbDatabaseDollar />}
      onClick={() => router.push("/financeiro")}
    >
      PAINEL FINANCEIRO
    </Button>
  );
}
