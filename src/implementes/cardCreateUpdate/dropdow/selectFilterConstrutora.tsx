"use client";
import { Flex, Select } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

export function SelectFilterConstrutora({ setLocalConstrutora }: { setLocalConstrutora: (id: number) => void }) {
  const [Construtora, setConstrutora] = useState<number | any>();
  const [ConstrutoraData, setConstrutoraData] = useState([]);

  useEffect(() => {
    const getConstrutora = async () => {
      const response = await fetch("/api/construtora/getall");
      const data = await response.json();
      setConstrutoraData(data);
    };
    getConstrutora();
  }, []);

  const handleConstrutoraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedConstrutoraId = Number(e.target.value);
    setConstrutora(selectedConstrutoraId);
    setLocalConstrutora(selectedConstrutoraId);
  };

  return (
    <>
      <Flex gap={2}>
        <Select
          border="1px solid #b8b8b8cc"
          borderTop={"none"}
          borderRight={"none"}
          borderLeft={"none"}
          borderRadius="6"
          mr={2}
          bg={"gray.100"}
          borderColor={"gray.400"}
          onChange={handleConstrutoraChange}
          value={Construtora}
        >
          <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
            Selecione uma construtora
          </option>
          {ConstrutoraData.length > 0 &&
            ConstrutoraData.map((construtora: any) => (
              <option
                style={{ backgroundColor: "#EDF2F7" }}
                key={construtora.id}
                value={construtora.id}
              >
                {construtora.fantasia}
              </option>
            ))}
        </Select>
      </Flex>
    </>
  );
}
