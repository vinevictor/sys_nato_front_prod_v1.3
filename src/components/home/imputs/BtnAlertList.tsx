"use client";
import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";
import { TbAlertSquareRounded } from "react-icons/tb";

interface BtnAlertListProps {
  session: SessionNext.Client;
}

export default function BtnAlertList({ session }: BtnAlertListProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Cont, setCont] = useState(0);
  const [Data, setData] = useState([]);
  const router = useRouter();

  const ConstTotalAlertas = async () => {
    if (session.role?.alert) {
      const url = "/api/alerts/geral/cont";
      const req = await fetch(url);
      const res = await req.json();
      if (req.ok) {
        setCont(res);
      }
    }
  };
  // TODO: remover componente
  const HandleAlertasList = async () => {
    if (session.role?.alert) {
      const url = "/api/alerts/geral/findAll";
      const req = await fetch(url);
      const res = await req.json();
      if (req.ok) {
        setData(res);
      }
    }
  };

  useEffect(() => {
    ConstTotalAlertas();
    HandleAlertasList();
  }, []);

  return (
    <>
      <Button
        w={"100%"}
        leftIcon={<TbAlertSquareRounded size={20} />}
        onClick={onOpen}
        variant="solid"
        colorScheme="green"
      >
        Alertas {Cont}
      </Button>

      <Modal
        onClose={onClose}
        size={"xl"}
        isOpen={isOpen}
        closeOnOverlayClick={false}
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alertas</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w={"100%"}
              h={"100%"}
              flexDir={"column"}
              gap={2}
              px={2}
              overflowY={"auto"}
            >
              {Data.map((item: any) => (
                <Flex
                  key={item.id}
                  px={4}
                  py={2}
                  borderRadius={"md"}
                  bg={"yellow.100"}
                  cursor={"pointer"}
                  _hover={{ bg: "yellow.200" }}
                  onClick={() =>
                    router.push(`/solicitacoes/${item.solicitacao_id}`)
                  }
                >
                  <Flex w={"2rem"} alignItems={"center"}>
                    <FaExclamationTriangle
                      style={{ margin: "auto" }}
                      size={14}
                      color="#daa300"
                    />
                  </Flex>
                  <Text fontSize={"sm"} fontWeight={"bold"}>
                    {item.titulo}
                  </Text>
                  <Text fontSize={"sm"}>
                    {item.descricao.slice(0, 40)}
                    {item.descricao.length > 40 ? "......." : ""}
                  </Text>
                </Flex>
              ))}
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>Fechar</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
