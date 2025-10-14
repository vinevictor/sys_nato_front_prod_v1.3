"use client";
import React, { useState, useEffect } from "react";
import { Box, FormLabel, Input, Stack } from "@chakra-ui/react";
import InputEmpreendimentoUf from "@/implementes/cardCreateUpdate/imputs/inputEmpreendimentoUf";
import InputEmpreendimentoCidade from "@/implementes/cardCreateUpdate/imputs/inputEmpreendimentoCidade";

// ===== TYPES =====
interface EmpreendimentoUfCidadeGroupProps {
  uf?: string;
  cidade?: string;
  id?: number;
  ufWidth?: string;
  cidadeWidth?: string;
}

// ===== COMPONENT =====
/**
 * Componente Cliente simples e flexível para gerenciar UF e Cidade
 *
 * Este componente integra diretamente os inputs de UF e Cidade,
 * gerenciando o estado compartilhado entre eles.
 *
 * Layout Responsivo:
 * - Mobile (< 768px): Campos em coluna (vertical)
 * - Desktop (≥ 768px): Campos em linha (horizontal)
 *
 * Regras de Negócio:
 * - Quando a UF é alterada, o valor da Cidade é resetado automaticamente
 * - O campo Cidade só fica habilitado após selecionar uma UF
 * - Input hidden com o ID do empreendimento para submissão do formulário
 *
 * @param uf - Valor inicial da UF (código do estado, ex: "SP")
 * @param cidade - Valor inicial da cidade
 * @param id - ID do empreendimento
 * @param ufWidth - Largura do campo UF no desktop (padrão: "120px")
 * @param cidadeWidth - Largura do campo Cidade (padrão: "100%")
 */
export default function EmpreendimentoUfCidadeGroup({
  uf,
  cidade,
  id,
}: EmpreendimentoUfCidadeGroupProps) {
  // Estado local para gerenciar a UF selecionada
  const [ufSelecionada, setUfSelecionada] = useState<string>(uf ?? "");
  // Estado para controlar quando resetar a cidade
  const [cidadeKey, setCidadeKey] = useState<number>(0);

  /**
   * Handler chamado quando a UF é alterada
   * Reseta o campo de cidade quando uma nova UF é selecionada
   */
  const handleUfChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const novaUf = e.target.value;
    
    // Se a UF mudou, reseta a cidade
    if (novaUf !== ufSelecionada) {
      setCidadeKey((prev) => prev + 1); // Força re-render do componente de cidade
    }
    
    setUfSelecionada(novaUf);
  };

  /**
   * Sincroniza o estado interno quando a prop externa muda
   */
  useEffect(() => {
    if (uf) {
      setUfSelecionada(uf);
    }
  }, [uf]);

  return (
    <Stack
      direction={{ base: "column", md: "row" }}
      spacing={3}
      width="100%"
      align="stretch"
    >
      {/* ===== CAMPO UF ===== */}
      <Box w={{ base: "100%", md: "50%" }} flexShrink={0}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          UF
        </FormLabel>
        <InputEmpreendimentoUf
          name="estado"
          variant="flushed"
          setUfValue={uf}
          borderColor="gray.400"
          px={1}
          bg="gray.100"
          onChange={handleUfChange}
        />
        {/* Input hidden com o ID para o formulário */}
        <Input hidden name="id" value={id} readOnly />
      </Box>

      {/* ===== CAMPO CIDADE ===== */}
      <Box w={{ base: "100%", md: "50%" }} flex={{ base: "0", md: "1" }}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          Cidade
        </FormLabel>
        <InputEmpreendimentoCidade
          key={cidadeKey} // Força re-render quando a UF muda
          name="cidade"
          variant="flushed"
          setCidadeValue={ufSelecionada === uf ? cidade : undefined}
          ufValue={ufSelecionada}
          borderColor="gray.400"
          px={1}
          bg="gray.100"
        />
      </Box>
    </Stack>
  );
}
