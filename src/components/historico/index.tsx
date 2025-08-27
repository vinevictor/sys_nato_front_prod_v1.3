import { Box, Heading, Text } from "@chakra-ui/react";

interface HistoricoPropsComponent {
  data: HistoricoProps[];
}

type HistoricoProps = {
  id: number;
  descricao: string;
  createAt: Date | string | any;
};

/**
 * HistoricoComponent
 * Renderiza uma linha do tempo com os itens de histórico.
 * Os itens são ordenados por `createAt` em ordem decrescente antes da renderização.
 */
export default function HistoricoComponent({
  data,
}: HistoricoPropsComponent) {
  // Ordena os itens por createAt em ordem decrescente (mais recente primeiro)
  const orderedData = [...(data ?? [])].sort((a, b) => {
    const ta = new Date(a.createAt).getTime();
    const tb = new Date(b.createAt).getTime();
    return tb - ta;
  });

  return (
    <Box
      h={{ base: "25rem", lg: "full" }}
      w={"full"}
      bg="gray.100"
      borderRadius="1rem"
      boxShadow="md"
      border="1px solid"
      borderColor="gray.200"
      px={4}
      py={8}
      display="flex"
      flexDirection="column"
    >
      <Box mb={4}>
        <Heading fontSize={"lg"}>Linha do tempo</Heading>
      </Box>
      
      <Box 
        flex="1" 
        overflowY="auto" 
        w="full"
        pr={2} // padding-right para compensar a scrollbar
      >
        {orderedData.map((item) => (
          <Box
            key={item.id}
            mb={2}
            p={2}
            borderRadius="1rem"
            boxShadow="md"
            border="1px solid"
            borderColor="blue.300"
          >
            <Text>{item.descricao}</Text>
            <Text fontSize="sm" color="gray.600">{item.createAt}</Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
}