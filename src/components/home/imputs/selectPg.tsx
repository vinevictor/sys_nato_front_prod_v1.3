import { Flex, IconButton, Text, useColorModeValue } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

interface SelectPgProps {
  total: number;
  ClientQtd: number;
  SelectPage: number;
  setSelectPage: (page: number) => void;
  SetVewPage: (page: number) => Promise<void>;
}

/**
 * Controla a navegação entre páginas exibindo botões anterior/próxima e seletor numérico.
 * Também aplica estilos consistentes com os layouts claro e escuro.
 */
export const SelectPgComponent = ({
  total,
  ClientQtd,
  SelectPage,
  setSelectPage,
  SetVewPage,
}: SelectPgProps) => {
  const totalPages = ClientQtd > 0 ? Math.ceil(total / ClientQtd) : 1;
  const isPrevDisabled = SelectPage <= 1 || totalPages <= 1;
  const isNextDisabled = SelectPage >= totalPages || totalPages <= 1;
  const textMuted = useColorModeValue("gray.600", "gray.300");

  const goToPage = async (page: number) => {
    if (page < 1 || page > totalPages) return;
    setSelectPage(page);
    await SetVewPage(page);
  };

  return (
    <Flex align="center" gap={3} flexWrap="wrap">
      <IconButton
        aria-label="Página anterior"
        icon={<FiChevronLeft />}
        size="sm"
        variant="ghost"
        colorScheme="green"
        isDisabled={isPrevDisabled}
        onClick={() => goToPage(SelectPage - 1)}
      />

      <Flex align="center" gap={1} minW="fit-content">
        <Text fontSize="sm" color={textMuted}>
          Página
        </Text>
        <Text
          fontSize="sm"
          fontWeight="semibold"
          color={useColorModeValue("gray.800", "gray.100")}
          px={3}
          py={1}
          borderRadius="md"
          borderWidth="1px"
          borderColor={useColorModeValue("gray.300", "gray.600")}
          bg={useColorModeValue("white", "gray.800")}
          minW="40px"
          textAlign="center"
        >
          {SelectPage}
        </Text>
        <Text fontSize="sm" color={textMuted}>
          de {totalPages}
        </Text>
      </Flex>

      <IconButton
        aria-label="Próxima página"
        icon={<FiChevronRight />}
        size="sm"
        variant="ghost"
        colorScheme="green"
        isDisabled={isNextDisabled}
        onClick={() => goToPage(SelectPage + 1)}
      />
    </Flex>
  );
};
