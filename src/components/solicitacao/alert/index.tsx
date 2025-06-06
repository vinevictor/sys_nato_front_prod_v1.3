import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface ListAlertasProps {
  id: number;
}
export default function ListAlertas({ id }: ListAlertasProps) {
  const [data, setData] = useState([]);

  useEffect(() => {
    (async () => {
      const req = await fetch(`/api/alerts/solicitacao/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      });
      if (req.ok) {
        const res = await req.json();
        setData(res);
      }
    })();
  }, [id]);
  return (
    <>
      <Flex
        w={{ base: "full", md: "full" }} // Ajuste a largura conforme necessário
        p={6} // Padding interno
        bg="white"
        borderRadius={8}
        boxShadow="2xl"
        direction={"column"}
      >
        <Box>
          <Text fontSize={{ base: "xl", md: "2xl" }}>Alertas</Text>
          <Divider my={4} />
        </Box>
        <Divider borderColor="#00713D" my={4} />
        <Flex gap={2} flexDir={"column"}>
          {data.map((item: any) => (
            <Flex
              gap={2}
              justifyContent={"space-between"}
              key={item.id}
              px={4}
              py={2}
              borderRadius={"md"}
              bg={"yellow.100"}
              cursor={"pointer"}
              _hover={{ bg: "yellow.200" }}
            >
              <Flex gap={2} alignItems={"center"}>
                <FaExclamationTriangle
                  style={{ margin: "auto" }}
                  size={14}
                  color="#daa300"
                />
                <Text fontSize={"sm"}>
                  {item.descricao.slice(0, 40)}
                  {item.descricao.length > 40 ? "......." : ""}
                </Text>
              </Flex>
              <Text fontSize={"sm"}>
                {item.createdAt
                  ? new Date(item.createdAt).toLocaleString()
                  : ""}
              </Text>
            </Flex>
          ))}
        </Flex>
      </Flex>
    </>
  );
}
