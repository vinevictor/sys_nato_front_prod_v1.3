"use client";
import { SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  ButtonProps,
  Flex,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiUser } from "react-icons/bi";

interface BtmConstrutoraListUserProps extends ButtonProps {
  data: any;
}

export function BtmConstrutoraListUser({
  data,
  ...props
}: BtmConstrutoraListUserProps) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} {...props}>
        {data.length}
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size={"2xl"}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Lista de Corretor e CCA</ModalHeader>
          <ModalCloseButton />
          <ModalBody overflow={"auto"} maxH={"45rem"}>
            {data.length > 0 &&
              data.map((item: any) => {
                return (
                    <Flex
                      key={item.id}
                      gap={2}
                      fontSize={"sm"}
                      px={5}
                      py={"0.3rem"}
                      justifyContent={"space-between"}
                      _hover={{
                        cursor: "pointer",
                        bg: "gray.200",
                        borderRadius: "8px",
                      }}
                    >
                      <Flex gap={2}>
                      nome:{" "}
                      <Text fontSize={"sm"} fontWeight={"bold"}>
                        {item.nome}
                      </Text>
                      , tipo: <Text fontWeight={"bold"}>{item.cargo}</Text>{''} 
                      </Flex>
                      <Flex>
                        <IconButton aria-label="config" colorScheme="green" icon={<SettingsIcon />} size="xs" onClick={() => router.push(`/usuarios/${item.id}`)}/>
                      </Flex>
                    </Flex>
                );
              })}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
