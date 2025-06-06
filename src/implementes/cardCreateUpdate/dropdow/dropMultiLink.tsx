"use client";
import {
  Box,
  Button,
  Divider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface DropConstrutoraProps {
  value?: any;
}

export default function DropMultiLink({ value }: DropConstrutoraProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [Data, setData] = useState<string>("");
  const [Data2, setData2] = useState<string>("");
  useEffect(() => {
    if (value) {
      const ValueMap = value.map((item: any) => item).join(",\n");
      setData(ValueMap);
      const ValueMap2 = value.map((item: any) => item).join(", ");
      setData2(ValueMap2);
    }
  }, [value]);

  const update = (e: any) => {
    const value = e.target.value;
    const limpo = value.replace(/\r?\n|\r/g, " ");
    setData(value)
    setData2(limpo.trim());
  }

  return (
    <>
      <Box>
        <Button colorScheme="green" onClick={onOpen}>
          Links
        </Button>

        <Modal onClose={onClose} isOpen={isOpen} size={"6xl"} isCentered>
          <ModalOverlay
            bg="none"
            backdropFilter="auto"
            backdropInvert="80%"
            backdropBlur="2px"
          />
          <ModalContent>
            <ModalHeader>Lista de Links para Assinatura</ModalHeader>
            <Divider />
            <ModalCloseButton />
            <ModalBody>
              <Textarea
                placeholder="Para adicionar mais de um link use , para separa-los ex: https://teste.com, https://teste.com.br"
                resize={"none"}
                h={"15rem"}
                name="links"
                value={Data}
                onChange={update}
              />
            </ModalBody>
            <Divider />
            <ModalFooter>
              <Button onClick={onClose}>Adicionar</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <Box hidden>
          <Textarea
            name="links"
            value={Data2}
            onChange={(e) => setData(e.target.value)}
            hidden
          />
        </Box>
      </Box>
    </>
  );
}
