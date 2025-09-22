"use client";
import { Session } from "@/types/session";
import { Flex } from "@chakra-ui/react";
import { useEffect, useState, useCallback  } from "react";
import SelectConstutora from "./constutora";
import SelectEmpreendimento from "./empreendimento";
import SelectFinanceira from "./financeiro";
import SelectUser from "./usuario";

type FormType = {
  "id": number,
  "nome": string,
  "email": string,
  "cpf": string,
  "telefone": string,
  "telefone2": string | null,
  "dt_nascimento": string,
  "id_fcw": number,
  "cnh": string | null,
  "ativo": boolean,
  "rela_quest": boolean,
  "distrato": boolean,
  "dt_distrato": Date | string | null,
  "status_aprovacao": boolean,
  "distrato_id": number | null,
  "andamento": string | null,
  "type_validacao": string | null,
  "dt_aprovacao": Date | string | null,
  "hr_aprovacao": Date | string | null,
  "dt_agendamento": Date | string | null,
  "hr_agendamento": Date | string | null,
  "estatos_pgto": string | null,
  "valorcd": number | string | null,
  "situacao_pg": number,
  "freqSms": number,
  "alertanow": boolean,
  "dt_criacao_now": Date | string | null,
  "statusAtendimento": boolean,
  "pause": boolean,
  "corretorId": number,
  "construtoraId": number,
  "financeiroId": number,
  "empreendimentoId": number,
  "createdAt": Date | string | null,
  "updatedAt": Date | string | null,
  "relacionamentos": string[],
  "dt_revogacao": Date | string | null,
  "direto": boolean,
  "txid": string | null,
  "pixCopiaECola": string | null,
  "imagemQrcode": string | null,
  "uploadCnh": string | null,
  "uploadRg": string | null,
  "sisapp"?: boolean | null,
  "obs": {
    "id": string,
    "data": string,
    "hora": string,
    "autor": string,
    "autor_id": number,
    "mensagem": string
  }[],
  "pg_andamento": string,
  "pg_date": Date | string | null,
  "pg_status": boolean,
  "corretor": {
    "id": number,
    "nome": string,
    "telefone": string
  },
  "construtora": {
    "id": number,
    "fantasia": string,
    "valor_cert": number
  },
  "empreendimento": {
    "id": number,
    "nome": string,
    "cidade": string,
    "estado": string,
    "tag": string
  },
  "financeiro": {
    "id": number,
    "fantasia": string,
    "tel": string,
    "valor_cert": number
  },
  "alerts": [
    {
      "id": number,
      "descricao": string,
      "status": boolean,
      "createdAt": string
    }
  ],
  "tags": [
    {
      "id": number,
      "solicitacao": number,
      "descricao": string,
      "createAt": string
    }
  ]

}
  

interface SelectConstEmpFinCorProps {
  session: Session.AuthUser;
  isAdmin: boolean;
  ValueConstrutora: (value: number) => void;
  ValueEmpreendimento: (value: number) => void;
  ValueFinanceira: (value: number) => void;
  ValueCorretor: (value: number) => void;
  Form?: FormType | null;
  edit?: boolean;
}

/**
 * @name SelectConstEmpFinCor
 * @description Componente de seleção de construtora, empreendimento, financeira e corretor
 * Parâmetros
 * @param session - Sessão do usuário
 * @param isAdmin - Se o usuário é admin
 * @param Form | null - dados do cliente
 *
 * Retornos obrigatórios
 * @returns ValueConstrutora - Função para setar o valor da construtora
 * @returns ValueEmpreendimento - Função para setar o valor do empreendimento
 * @returns ValueFinanceira - Função para setar o valor da financeira
 * @returns ValueCorretor - Função para setar o valor do corretor
 *
 */
export default function SelectConstEmpFinCor({
  session,
  isAdmin,
  ValueConstrutora,
  ValueEmpreendimento,
  ValueFinanceira,
  ValueCorretor,
  Form,
  edit = false
}: SelectConstEmpFinCorProps) {
  const [form, setForm] = useState({
    construtora: Form?.construtoraId || 0,
    empreendimento: Form?.empreendimentoId || 0,
    financeira: Form?.financeiroId || 0,
    corretor: Form?.corretorId || 0,
  });


  const SetPropForm = useCallback((field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  }, []);


  useEffect(() => {
    ValueConstrutora(form.construtora);
  }, [form.construtora]);

  useEffect(() => {
    ValueEmpreendimento(form.empreendimento);
  }, [form.empreendimento]);

  useEffect(() => {
    ValueFinanceira(form.financeira);
  }, [form.financeira]);

  useEffect(() => {
    ValueCorretor(form.corretor);
  }, [form.corretor]);

  const handleSelectConst = (value: number) => {
    SetPropForm("construtora", Number(value));
    ValueConstrutora(Number(value));
    if (Form && Form?.construtoraId !== value) {
      SetPropForm("empreendimento", 0);
      SetPropForm("financeira", 0);
      SetPropForm("corretor", 0);
    }
  };

  const handleSelectEmp = (value: number) => {
    SetPropForm("empreendimento", Number(value));
    ValueEmpreendimento(Number(value));
    if (Form && Form?.empreendimentoId !== value) {
      SetPropForm("financeira", 0);
      SetPropForm("corretor", 0);
    }
  };

  const handleSelectFin = (value: number) => {
    SetPropForm("financeira", Number(value));
    ValueFinanceira(Number(value));
    if (Form && Form?.financeiroId !== value) {
      SetPropForm("corretor", 0);
    }
  };

  const handleSelectCor = (value: number) => {
    SetPropForm("corretor", Number(value));
    ValueCorretor(Number(value));
  };

  return (
    <>
      <Flex
        w={"full"}
        // justifyContent={"center"}
        flexWrap={{ base: "wrap", md: "nowrap" }}
        gap={4}
        mb={2}
      >
        <SelectConstutora
          session={session}
          isAdmin={isAdmin}
          ValueConst={handleSelectConst}
          FormConst={Form?.construtora ? [Form.construtora] : []}
          FormConstId={Form?.construtoraId || 0}
          edit={edit}
        />
        <SelectEmpreendimento
          session={session}
          isAdmin={isAdmin}
          ValueEmpreendimento={handleSelectEmp}
          FormEmp={Form?.empreendimento ? [Form.empreendimento] : []}
          FormEmpId={form.empreendimento}
          constId={form.construtora}
          edit={edit}
        />
        <SelectFinanceira
          session={session}
          isAdmin={isAdmin}
          ValueFinanceira={handleSelectFin}
          FormFin={Form?.financeiro ? [Form.financeiro] : []}
          FormFinId={form.financeira}
          constId={form.construtora}
          empId={form.empreendimento}
          edit={edit}
        />

        {isAdmin && (
          <SelectUser
            session={session}
            isAdmin={isAdmin}
            ValueUser={handleSelectCor}
            FormUser={Form?.corretor ? [Form.corretor] : []}
            FormUserId={form.corretor}
            constId={form.construtora}
            empId={form.empreendimento}
            finId={form.financeira}
            edit={edit}
          />
        )}
      </Flex>
    </>
  );
}

// 493.646.890-89
