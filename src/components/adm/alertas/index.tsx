import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Divider,
  Flex,
  Heading,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface AlertasProps {
    id: number,
    descricao: string,
    status: boolean,
    createAt: string,
    updatedAt: string
}

export default function Alertas() {
  const [alertas, setAlertas] = useState<AlertasProps[]>([]);
  const toast = useToast();

  useEffect(() => {
    fetchAlertas();
  }, []);

  const fetchAlertas = async () => {
    try {
      const req = await fetch("/api/bug_report");
      const data = await req.json();
      setAlertas(data);
    } catch (error) {
      console.log(error);
    }
  };

  const HandleDelete = async (id: number) => {
    try {
      const req = await fetch(`/api/bug_report/delete/${id}`, {
        method: "DELETE",
      });
      const data = await req.json();
      if (!req.ok) {
        toast({
          title: "Erro ao remover alerta",
          description: data.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      toast({
        title: "Alerta removido com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      fetchAlertas();
    } catch (error: any) {
      console.log(error);
      toast({
        title: "Erro ao remover alerta",
        status: error.message,
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box
        bg="white"
        borderRadius="lg"
        p={{ base: 3, md: 6 }}
        boxShadow="md"
        w="100%"
      >
        <Text fontSize={{ base: "lg", md: "xl" }} fontWeight="bold">
          Alertas Gerais
        </Text>
        <Divider borderColor="gray.300" my={2} />
        <Flex h={"19.5rem"} overflowY="auto" flexDirection="column" gap={3}>
          {alertas.map((alerta: AlertasProps) => (
            <Card
              direction="row"
              key={alerta.id}
              border="1px solid"
              borderColor="gray.300"
              borderRadius="xl"
              boxShadow="lg"
              p={2}
              alignItems="center"
            >
              <CardBody>
                <Text>
                  {alerta.descricao} -{" "}
                  {alerta.createAt &&
                    alerta.createAt
                      .split("T")[0]
                      .split("-")
                      .reverse()
                      .join("/")}{" "}
                  {alerta.createAt &&
                    alerta.createAt.split("T")[1].split(".")[0]}
                </Text>
              </CardBody>
              <CardFooter>
                <Button
                  colorScheme="red"
                  size="xs"
                  onClick={() => HandleDelete(alerta.id)}
                >
                  Remover
                </Button>
              </CardFooter>
            </Card>
          ))}
        </Flex>
      </Box>
    </>
  );
}
