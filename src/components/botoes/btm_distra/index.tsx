import {
  Box,
  Button,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MouseEvent } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import { SessionServer } from "@/types/session";

interface BotoesFunctionProps {
  id: number;
  distrato: boolean;
  exclude?: boolean;
  session: SessionServer | null;
}

export default function BtmDistrato({ id, distrato, exclude, session }: BotoesFunctionProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const User = session?.user;
  const HandleDelet = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const Get = await fetch(`/api/solicitacao/get/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const req = await Get.json();
      
      const res = await fetch(`/api/solicitacao/update/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          distrato: true,
          distrato_id: User?.id,
          distrato_dt: new Date().toISOString(),
          ...(req.logDelete !== null && {
            logDelete: `${req.logDelete}\nO usuário: ${User?.nome}, id: ${
              User?.id
            } Solicitou distrato para esse registro em: ${new Date().toLocaleDateString(
              "pt-BR"
            )} as ${new Date().toLocaleTimeString("pt-BR")}`,
          }),
          ...(req.logDelete === null && {
            logDelete: `O usuário: ${User?.nome}, id: ${
              User?.id
            } Solicitou distrato para esse registro em: ${new Date().toLocaleDateString(
              "pt-BR"
            )} as ${new Date().toLocaleTimeString("pt-BR")}`,
          }),
        }),
      });

      if (res.ok) {
        toast({
          title: "Distrato Efetuado",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onClose();
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: JSON.stringify(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      onClose();
    }
  };
  return (
    <>
      <Tooltip label="Distrato">
        <Box
          p={"3.2px"}
          border={"1px solid gray"}
          borderRadius={"6px"}
          cursor={"pointer"}
          onClick={onOpen}
          _hover={{ bg: "gray.300" }}
          hidden={distrato || exclude}
          w={"30px"}
        >
          <Image src="/rasgado.png" alt="distrato" boxSize={"24px"} />
        </Box>
      </Tooltip>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalBody p={10}>
            <Text fontWeight={"bold"} fontSize={"20px"} textAlign={"center"}>
              Você tem certeza de que deseja efetuar o distrato com esse
              cliente?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Flex gap={3}>
              <Button leftIcon={<IoIosArrowBack />} onClick={onClose}>
                NÃO
              </Button>

              <Button
                leftIcon={<BsFillTrashFill />}
                onClick={HandleDelet}
                colorScheme="red"
              >
                SIM
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
