"use client";
import { useState, useEffect } from "react";
import {
  Button,
  Checkbox,
  Text,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  ModalFooter,
  useToast,
  Box,
} from "@chakra-ui/react";

interface BtnAlertNowProps {
  id: number;
  andamento: string;
  ativo: boolean;
  distrato: boolean;
  construtora: any;
  alertanow: boolean;
}

export default function BtnAlertNow({
  id,
  construtora,
    alertanow

}: BtnAlertNowProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [checkedCNH, setCheckedCNH] = useState(false);
  const [checkedClientePresente, setCheckedClientePresente] = useState(false);
  const [checkedClienteDisponivel, setCheckedClienteDisponivel] =
    useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [alertaNowState, setAlertaNowState] = useState(alertanow);
  const toast = useToast();
  const idConstrutora = construtora.id

  const handleCancel = async () => {
    // const req = await CancelAlertaNow(id);
    const req = await fetch(`/api/alertanow/putNow/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alertanow: false,
      }),
    })

    if(!req.ok){
      toast({
        position: "top",
        title: "Erro ao cancelar alerta!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }else{
        toast({
            position: "top",
            title: "Alerta cancelado com sucesso!",
            status: "success",
            duration: 9000,
            isClosable: true,
        });
        setAlertaNowState(false);
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
  }

  const handleConfirm = async () => {
    const now = new Date();

    const hora = now.getHours();
    const minutos = now.getMinutes();
  
    const dentroHorario = (hora > 9 || (hora === 9 && minutos >= 30)) && hora <= 18

    if(!dentroHorario){
      toast({
        position: "top",
        title: "Somente entre 9:30 e 18:00",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return
    }
    const req = await fetch(`/api/alertanow/putNow/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        alertanow: true
      })
    });
    if (!req.ok) {
      toast({
        position: "top",
        title: "Erro ao criar alerta!",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        position: "top",
        title: "Alerta criado com sucesso!",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      setAlertaNowState(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    onClose();
  };

  useEffect(() => {
    
    if (checkedCNH && checkedClientePresente && checkedClienteDisponivel) {
      setIsButtonDisabled(false);
    } else {
      setIsButtonDisabled(true);
    }
  }, [checkedCNH, checkedClientePresente, checkedClienteDisponivel,alertaNowState]);

  return (
    
    <>{idConstrutora === 5 ? (<>{alertaNowState ? (<>
    <Button
            onClick={handleCancel}
            variant={"outline"}
            _hover={{ bg: "red.300", color: "white", border: "none" }}
            colorScheme="red"
    >
        CANCELAR NOW
    </Button>
    </>) :(
        <>
        <Button
        onClick={onOpen}
        variant={"outline"}
        _hover={{ bg: "orange.300", color: "white", border: "none" }}
        colorScheme="orange"
      >
        NOW
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alerta NOW</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text fontSize={"sm"}>
              {" "}
              Caso documento seja RG estará sujeito a verificação.
            </Text>
            <Checkbox
              isChecked={checkedCNH}
              onChange={() => setCheckedCNH(!checkedCNH)}
              colorScheme="teal"
              size="lg"
            >
              CNH/RG anexado?
            </Checkbox>
            <br />
            <Checkbox
              isChecked={checkedClientePresente}
              onChange={() =>
                setCheckedClientePresente(!checkedClientePresente)
              }
              colorScheme="teal"
              size="lg"
            >
              Cliente presente na loja?
            </Checkbox>
            <br />
            <Checkbox
              isChecked={checkedClienteDisponivel}
              onChange={() =>
                setCheckedClienteDisponivel(!checkedClienteDisponivel)
              }
              colorScheme="teal"
              size="lg"
            >
              Cliente disponível para fazer agora?
            </Checkbox>
          </ModalBody>

          <ModalFooter gap={2}>
            <Button variant="ghost" onClick={onClose}>
              Fechar
            </Button>
            <Button
              colorScheme="blue"
              onClick={handleConfirm}
              isDisabled={isButtonDisabled}
            >
              Confirmar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </>
    )}</>) : <Box hidden></Box>}
      
    </>
  );
}
