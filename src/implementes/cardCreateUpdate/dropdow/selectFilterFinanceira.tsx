"use client";
import {
  Flex,
  Select,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";



export function SelectFilterFinanceira({setLocalFinanceira}:  { setLocalFinanceira: (id: number) => void }){
    const [Financeira, setFinanceira] = useState<number | undefined>();
    const [FinanceiraData, setFinanceiraData] = useState([]);

    useEffect(() => {
        const getFinanceira = async () => {
            const response = await fetch("/api/financeira/getall");
            const data = await response.json();
            setFinanceiraData(data);
        };
        getFinanceira();
    }, []);

    const handleFinanceiraChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedFinanceiraId = Number(e.target.value);
        setFinanceira(selectedFinanceiraId);
        setLocalFinanceira(selectedFinanceiraId);
      };
    



    return(
        <>
        <Flex gap={2}>
            <Select
                mr={2}
                border="1px solid #b8b8b8cc"
                borderTop={"none"}
                borderRight={"none"}
                borderLeft={"none"}
                borderRadius="6"
                bg={"gray.100"}
                borderColor={"gray.400"}
                onChange={handleFinanceiraChange}
                value={Financeira}
            >
                <option style={{ backgroundColor: "#EDF2F7" }} value={0}>
                    Selecione uma financeira
                </option>
                {FinanceiraData.length > 0 &&
                FinanceiraData.map((Financeira: any) => (
              <option
                style={{ backgroundColor: "#EDF2F7" }}
                key={Financeira.id}
                value={Financeira.id} 
              >
                {Financeira.fantasia}
              </option>
            ))}
            </Select>
        </Flex>
        </>
    );
}
