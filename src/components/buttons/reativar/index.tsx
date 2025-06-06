import { Button, ButtonProps, useToast } from "@chakra-ui/react";

interface ReativarButtonProps extends ButtonProps {
  solicitacaoId?: number;
  children: React.ReactNode;
}
export default function ReativarButton({
  children,
  solicitacaoId,
  ...props
}: ReativarButtonProps) {
  const toast = useToast();
  const handleReativar = async () => {
    try {
      const req = await fetch(`/api/solicitacao/reactivate/${solicitacaoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!req.ok) {
        toast({
          title: "Erro ao ativar solicitação",
          description: "Tente novamente mais tarde",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Solicitação reativada",
          description: "Solicitação reativada com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao ativar solicitação:", error);
      toast({
        title: "Erro ao ativar solicitação",
        description: "ERRO DESCONHECIDO",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Button {...props} onClick={handleReativar}>
      {children}
    </Button>
  );
}
