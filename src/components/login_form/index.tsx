"use client";

import {
  Input,
  FormControl,
  FormLabel,
  Button,
  useToast,
  Flex,
  CircularProgress
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SenhaComponent } from "../Senha";

export const FormLogin = () => {
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();

  const handlesubmit = async () => {
    setLoading(true);
    const res: any = await fetch('/api/auth', {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (res.status !== 200) {
      toast({
        title: "Erro!",
        description: `${data.message}`,
        status: "error",
        duration: 5000
      });
      setLoading(false);
    } else {
      router.replace("/home");
    }
  };

  if (loading) {
    return (
      <Flex
        w={"100%"}
        h={"100%"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <CircularProgress
          size="10rem"
          p={10}
          isIndeterminate
          color="green.300"
        />
      </Flex>
    );
  }
  return (
    <>
      <FormControl>
        <FormLabel 
          fontSize="14px" 
          fontWeight="500" 
          color="#2D3748"
          mb="2"
        >
          Usuário
        </FormLabel>
        <Input
          type="text"
          size="lg"
          height="48px"
          border="2px solid #E2E8F0"
          borderRadius="8px"
          textTransform="uppercase"
          fontSize="16px"
          bg="white"
          _hover={{ 
            borderColor: "#CBD5E0" 
          }}
          _focus={{ 
            borderColor: "#3182CE",
            boxShadow: "0 0 0 1px #3182CE"
          }}
          onChange={(e: any) => setUsername(e.target.value.toUpperCase())}
          value={username}
          placeholder="Digite seu usuário"
        />
        
        <FormLabel 
          fontSize="14px" 
          fontWeight="500" 
          color="#2D3748"
          mb="2"
          mt="6"
        >
          Senha
        </FormLabel>
        <SenhaComponent
          setvalue={password}
          onvalue={(e: any) => setPassword(e)}
          envClick={handlesubmit}
        />
      </FormControl>
      
      <Button
        mt="8"
        mb="4"
        width="100%"
        height="48px"
        bg="#3182CE"
        color="white"
        fontSize="16px"
        fontWeight="600"
        borderRadius="8px"
        _hover={{ 
          bg: "#2C5282",
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(49, 130, 206, 0.4)"
        }}
        _active={{ 
          transform: "translateY(0)" 
        }}
        transition="all 0.2s"
        onClick={handlesubmit}
      >
        ACESSAR
      </Button>
    </>
  );
};
