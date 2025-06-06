"use client";


import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { MouseEvent } from "react";
import { BsBoxArrowUpRight, BsFillTrashFill } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import BtmDistrato from "../btm_distra";
import { useRouter } from "next/navigation";
import { SessionServer } from "@/types/session";


interface BotoesFunctionProps {
  id: number;
  distrato: boolean;
  exclude?: boolean;
  session: SessionServer | null;
}

export const BotoesFunction = ({ id, distrato, exclude, session }: BotoesFunctionProps) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const route = useRouter();



  const HandleDelet = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/solicitacao/delete/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        toast({
          title: "Solicitação deletada",
          description: "Solicitação deletada com sucesso",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        route.refresh();
      }
    } catch (error) {
      toast({
        title: "Erro, em remover a solicitação",
        description: JSON.stringify(error),
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const HandleRedirect = () => {
    window.open(`/solicitacoes/${id}`, "_blank");
  }

  return (
    <Flex justifyContent={"start"} alignItems={"center"} gap={"5px"}>
      <ButtonGroup variant="solid" size="sm" spacing={3}>
        <IconButton
          colorScheme="blue"
          icon={<BsBoxArrowUpRight />}
          aria-label="Up"
          onClick={HandleRedirect}
        />
        <Box hidden={exclude}>
          <IconButton
            colorScheme="red"
            variant="outline"
            icon={<BsFillTrashFill />}
            aria-label="Delete"
            onClick={onOpen}
            _hover={{ bg: "red.300", color: "white", border: "none" }}
          />
        </Box>
        <BtmDistrato id={id} distrato={distrato} exclude={exclude} session={session} />
      </ButtonGroup>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />

        <ModalContent>
          <ModalBody p={10}>
            <Text fontWeight={"bold"} fontSize={"20px"} textAlign={"center"}>
              Você tem certeza de que deseja deletar esta solicitação?
            </Text>
          </ModalBody>

          <ModalFooter>
            <Flex gap={3}>
              <Button
                colorScheme="blue"
                leftIcon={<IoIosArrowBack />}
                onClick={onClose}
              />
              <Button
                onClick={(e) => HandleDelet(e)}
                colorScheme="red"
              >
                Confirmar Exclusão
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
