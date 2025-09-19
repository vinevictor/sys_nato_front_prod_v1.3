"use client";

import { Button, Input, Select, SimpleGrid } from "@chakra-ui/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

interface FiltroChamadosProps {
  statusUnicos: string[];
  prioridadesUnicas: string[];
  departamentosUnicos: string[];
}

export default function FiltroChamados({
  statusUnicos,
  prioridadesUnicas,
  departamentosUnicos,
}: FiltroChamadosProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [busca, setBusca] = useState(searchParams.get("busca") || "");
  const [id, setId] = useState(searchParams.get("id") || "");
  const [status, setStatus] = useState(searchParams.get("status") || "");
  const [prioridade, setPrioridade] = useState(
    searchParams.get("prioridade") || ""
  );
  const [departamento, setDepartamento] = useState(
    searchParams.get("departamento") || ""
  );

  useEffect(() => {
    setBusca(searchParams.get("busca") || "");
    setId(searchParams.get("id") || "");
    setStatus(searchParams.get("status") || "");
    setPrioridade(searchParams.get("prioridade") || "");
    setDepartamento(searchParams.get("departamento") || "");
  }, [searchParams]);

  const handleFilter = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (busca) params.set("busca", busca);
    if (id) params.set("id", id);
    if (status) params.set("status", status);
    if (prioridade) params.set("prioridade", prioridade);
    if (departamento) params.set("departamento", departamento);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleClear = () => {
    setBusca("");
    setId("");
    setStatus("");
    setPrioridade("");
    setDepartamento("");
    router.push(pathname);
  };

  return (
    <form onSubmit={handleFilter}>
      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3, lg: 7 }}
        spacing={4}
        alignItems="center"
      >
        <Input
          name="busca"
          placeholder="Buscar por termo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <Input
          name="id"
          placeholder="ID do chamado"
          value={id}
          onChange={(e) => setId(e.target.value)}
        />
        <Select
          name="status"
          placeholder="Status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          {statusUnicos.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
        <Select
          name="prioridade"
          placeholder="Prioridade"
          value={prioridade}
          onChange={(e) => setPrioridade(e.target.value)}
        >
          {prioridadesUnicas.map((p) => (
            <option key={p} value={p}>
              {p.toUpperCase()}
            </option>
          ))}
        </Select>
        <Select
          name="departamento"
          placeholder="Departamento"
          value={departamento}
          onChange={(e) => setDepartamento(e.target.value)}
        >
          {departamentosUnicos.map((d) => (
            <option key={d} value={d}>
              {d.toUpperCase()}
            </option>
          ))}
        </Select>
        <Button type="submit" colorScheme="green">
          Filtrar
        </Button>
        <Button type="button" onClick={handleClear} colorScheme="gray">
          Limpar
        </Button>
      </SimpleGrid>
    </form>
  );
}
