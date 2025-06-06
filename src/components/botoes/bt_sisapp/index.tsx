"use client";
import React from "react";
import { Button } from "@chakra-ui/react";

export const BotaoSisapp = ({ body }: { body: any }) => {
  const handleUpdateSolicitacao = async () => {
    try {

        // Format date according to the required format
        const formatDate = (dateString: string | number | Date) => {
            if (!dateString) return null;
            const date = new Date(dateString);
            return date.toISOString();
        };
        
        const requestBody = {
            nome: body.nome,
            cpf: body.cpf,
            email: body.email,
            telefone: body.telefone,
            telefone2: body.telefone2,
            dtNascimento:body.dt_nascimento,
            dtSolicitacao:body.createdAt,
            idFcw: body.id_fcw,
            ativo: body.ativo,
            andamento: body.andamento,
            statusPgto: body.estatos_pgto,
            valorCd: body.valorcd,
            docSuspenso: null,
            alertaNow: body.alertanow || false,
            dtCriacaoNow: body.dt_criacao_now,
            statusAtendimento: body.statusAtendimento,
            corretor: JSON.stringify({
                id: body.corretor.id,
                nome: body.corretor.nome,
                telefone: body.corretor.telefone
            }),
            construtora: JSON.stringify({
                id: body.construtora.id,
                fantasia: body.construtora.fantasia
            }),
            empreendimento: JSON.stringify({
                id: body.empreendimento.id,
                nome: body.empreendimento.nome,
                cidade: body.empreendimento.cidade,
                uf: body.empreendimento.estado,
                tag: body.empreendimento.tag
            }),
            financeiro: JSON.stringify({
                id: body.financeiro.id,
                fantasia: body.financeiro.fantasia
            })
        };
        console.log(requestBody)

      

      const response = await fetch('https://apinatoapp.redebrasilrp.com.br/cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        
        },
        body: JSON.stringify(requestBody)
      });

     
      if (response.ok) {
        const data = await response.json();
        console.log('Solicitação enviada com sucesso:', data);
        alert('Solicitação enviada com sucesso!');
      } else {
        console.error('Erro ao enviar solicitação:', response.statusText);
        alert(`Erro ao enviar solicitação: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro ao processar a requisição:', error);
      alert(`Erro ao processar a requisição: ${error}`);
    }
  };

  return (
    <Button
      colorScheme="blue"
      size="sm"
      onClick={handleUpdateSolicitacao}
    >
      SISAPP
    </Button>
  );
};

export default BotaoSisapp;