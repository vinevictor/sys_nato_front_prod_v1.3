"use client";
import React from "react";
import { Button, useToast } from "@chakra-ui/react";

export const BotaoSisapp = ({ body }: { body: any }) => {
  const toast = useToast();
  const handleUpdateSolicitacao = async () => {
    try {
      const requestBody = {
        nome: body.nome,
        cpf: body.cpf,
        email: body.email,
        telefone: body.telefone,
        dtNascimento: body.dt_nascimento,
        dtSolicitacao: body.createdAt,
        idFcw: body.id_fcw,
        ativo: body.ativo,
        andamento: body.andamento,
        statusPgto: body.situacao_pg,
        valorCd: body.construtora.valor_cert,
        docSuspenso: null,
        alertaNow: body.alertanow || false,
        dtCriacaoNow: body.dt_criacao_now || null,
        statusAtendimento: body.statusAtendimento,
        corretor: JSON.stringify({
          id: body.corretor.id,
          nome: body.corretor.nome,
          telefone: body.corretor.telefone,
        }),
        construtora: JSON.stringify({
          id: body.construtora.id,
          fantasia: body.construtora.fantasia,
        }),
        empreendimento: JSON.stringify({
          id: body.empreendimento.id,
          nome: body.empreendimento.nome,
          cidade: body.empreendimento.cidade,
          uf: body.empreendimento.estado || "Sem Cadastro",
          tag: body.empreendimento.tag,
        }),
        financeiro: JSON.stringify({
          id: body.financeiro.id,
          fantasia: body.financeiro.fantasia,
        }),
      };

      const response = await fetch(`/api/sisapp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      const data = await response.json();

      if (!response.ok) {
        toast({
          title: "Foram encontrados erros no formulário",
          description: (
            <>
              {data.message.map((mensagem: string, index: number) => (
                <p key={index}>{mensagem}</p>
              ))}
            </>
          ),
          status: "error",
          duration: 6000,
          isClosable: true,
          position: "top",
        });
      } else {
        toast({
          title: "Arquivo enviado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.log("Erro ao processar a requisição:", error);
      alert(`Erro ao processar a requisição: ${error}`);
    }
  };

  return (
    <Button colorScheme="blue" size="sm" onClick={handleUpdateSolicitacao}>
      SISAPP
    </Button>
  );
};

export default BotaoSisapp;
