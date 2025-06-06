'use client';
import { Button } from "@chakra-ui/react";
import axios from "axios";

interface BotaoChamadoNivelDoisProps {
    id: number
    status: number
}

export default function BotaoChamadoNivelDois({id, status}: BotaoChamadoNivelDoisProps) {

    const definirStatus = () => {
        if (status === 1) {
          return {
            id: id,
            status: 2
          }
        }else if (status === 2) {
          return {
            id: id,
            status: 1
          }
        }
    }

    const data = definirStatus()
   const handleMudarStatusN2 = async () => {
    try {
        await axios.put('/api/chamado/back/putStatus', data);
        window.location.reload();
      } catch (error) {
        console.error("Erro ao enviar resposta:", error);
      }
   }

    return(
      <>
      { status === 1 ? (
        <Button
        variant={"outline"}
        colorScheme="orange"
        _hover={{ bg: "orange.500", color: "white" }}
        size={"sm"}
        onClick={handleMudarStatusN2}
      >
        Mudar Status Para N2
      </Button>
      ) : (
        <Button
        variant={"outline"}
        colorScheme="red"
        _hover={{ bg: "red", color: "white" }}
        size={"sm"}
        onClick={handleMudarStatusN2}
      >
        Cancelar Status de N2
      </Button>
      )}
      </>


    )

}