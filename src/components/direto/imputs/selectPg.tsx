"use client";
import { IconButton, Select } from "@chakra-ui/react";
import { IoIosArrowForward } from "react-icons/io";

interface SelectPgProps {
  total: number;
  ClientQtd: number;
  SelectPage: number;
  setSelectPage: (page: number) => void;
  SetVewPage: (page: number) => void;
}

export const SelectPgComponent = ({ total, ClientQtd, SelectPage, setSelectPage, SetVewPage }: SelectPgProps) => {
  const OptionsSelect = () => {
    if (!total || !ClientQtd) return null; // Verifica se total e ClientQtd existem
    const TotalPages = Math.ceil(total / ClientQtd);
    const options = [];
    for (let i = 1; i <= TotalPages; i++) {
      options.push(
        <option key={i} value={i}>
          {i}
        </option>
      );
    }
    return options;
  };
  return (
    <>
      <Select
        size={"xs"}
        borderRadius={"5px"}
        value={SelectPage}
        name="SelectedPage"
        onChange={(e: { target: { value: any } }) => {
          setSelectPage(Number(e.target.value));
        }}
      >
        <OptionsSelect />
      </Select>
      <IconButton
        icon={<IoIosArrowForward />}
        size={"xs"}
        colorScheme="green"
        aria-label={""}
        onClick={() => SetVewPage(SelectPage)}
      />
    </>
  );
};
