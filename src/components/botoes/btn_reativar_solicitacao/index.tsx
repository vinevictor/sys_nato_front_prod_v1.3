'use client'
import { Button, useToast } from "@chakra-ui/react";
import { FaRecycle } from "react-icons/fa";

interface BotaoReativarSolicitacaoProps {
    id: number
}
export default function BotaoReativarSolicitacao({id}: BotaoReativarSolicitacaoProps) {
    const toast = useToast();
    const handleReativar = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try{
          const req = await fetch(`/api/solicitacao/reactivate/${id}`,  {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
        })
        if(req.ok){
            toast({
                title: "Solicitação reativada",
                description: "Solicitação reativada com sucesso",
                status: "success",
                duration: 3000,
                isClosable: true,
                })
                setTimeout(() => {
                    window.location.reload();
                  }, 2000);
            }else{
            toast({
                title: "Erro ao reativar a solicitação",
                description: "Erro ao reativar a solicitação",
                status: "error",
                duration: 3000,
                isClosable: true,
            })
        }
        }catch(err){
          console.log(err)
        }
    }
    
    return (
        <Button
        leftIcon={<FaRecycle />}
        size={"sm"}
        colorScheme="green"
        onClick={(e) => handleReativar(e)}
        >
            REATIVAR SOLICITAÇÃO
        </Button>
    )
    
}