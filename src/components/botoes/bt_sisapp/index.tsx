"use client";
import React, { useState } from "react";
import { Button, useToast } from "@chakra-ui/react";

interface BotaoSisappProps {
  body: solictacao.SolicitacaoObjectDiretoType;
  ativo?: boolean;
}

export const BotaoSisapp = ({ body, ativo = false }: BotaoSisappProps) => {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const handleUpdateSolicitacao = async () => {
    try {
      const requestBody = {
        id: body.id,
        nome: body.nome,
        cpf: body.cpf,
        email: body.email,
        telefone: body.telefone,
        dtNascimento: body.dt_nascimento,
        dtSolicitacao: body.createdAt,
        ...(body.id_fcw && { idFcw: body.id_fcw }),
        ativo: body.ativo,
        andamento: body.andamento ? body.andamento : "SISAPP",
        statusPgto: body.situacao_pg,
        valorCd: body.construtora
          ? body.construtora.valor_cert
          : body.financeiro.valor_cert
          ? body.financeiro.valor_cert
          : body.valorcd,
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
          id: body.construtora?.id,
          fantasia: body.construtora?.fantasia,
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

      setIsLoading(true);
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
              {data.length > 1 ? (
                data.map((mensagem: string, index: number) => (
                  <p key={index}>{mensagem}</p>
                ))
              ) : (
                <p>{data.message}</p>
              )}
            </>
          ),
          status: "error",
          duration: 6000,
          isClosable: true,
          position: "top",
        });
        setIsLoading(false);
      } else {
        toast({
          title: "Arquivo enviado com sucesso!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      alert(`Erro ao processar a requisição: ${error}`);
    }
  };

  // TODO: verificar se a solicitação ja foi enviada para o sisapp

  return (
    <Button
      colorScheme="blue"
      size="sm"
      onClick={handleUpdateSolicitacao}
      isLoading={isLoading}
      disabled={ativo}
    >
      SISAPP
    </Button>
  );
};

export default BotaoSisapp;
