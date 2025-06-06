import { Box, Heading, Text } from "@chakra-ui/react";

interface HistoricoPropsComponent {
  data: HistoricoProps[];
}

type HistoricoProps = {
  id: number;
  descricao: string;
  createAt: Date | string | any;
};

export default function HistoricoComponent({
  data,
}: HistoricoPropsComponent) {
  return (
    <>
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
      >
        <Box mb={4}>
          <Heading fontSize={"lg"}>Linha do tempo</Heading>
        </Box>
        <Box w="full" overflowY="auto" h={"full"}>
          {data.map((item) => (
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
              <Text>{item.createAt}</Text>
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
}
