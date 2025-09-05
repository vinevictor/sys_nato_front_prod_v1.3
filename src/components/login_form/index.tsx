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
        <FormLabel>Usuario</FormLabel>
        <Input
          type="text"
          size={"lg"}
          border={"1px solid #b8b8b8cc"}
          textTransform={"uppercase"}
          onChange={(e: any) => setUsername(e.target.value.toUpperCase())}
          value={username}
        />
        <FormLabel> Senha</FormLabel>
        <SenhaComponent
          setvalue={password}
          onvalue={(e: any) => setPassword(e)}
          envClick={handlesubmit}
        />
      </FormControl>
      <Button
        mt={5}
        mb={5}
        variant="outline"
        width="250px"
        height="50px"
        maxWidth="100%"
        border={"1px solid #b8b8b8cc"}
        textColor={"Black"}
        onClick={handlesubmit}
      >
        ACESSAR
      </Button>
    </>
  );
};
