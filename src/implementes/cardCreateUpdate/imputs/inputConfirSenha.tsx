'use client';
import { Button, Input, InputGroup, InputRightElement } from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"


export function InputConfirSenha() {
  const [show, setShow] = useState(false);
  const [confirSenha, setSenha] = useState("");

  const handleClick = () => setShow(!show);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSenha(value);      
  };

  return (
    <>
    <InputGroup size="md">
      <Input
        name="confirsenha"
        pr="4.5rem"
        type={show ? "text" : "password"}
        placeholder="Confirme sua senha"
        value={confirSenha}
        onChange={handleChange}
        variant="flushed"
        bg="gray.100"
        borderColor="gray.400"
        px={1}
        _dark={{
          bg: "gray.700",
          borderColor: "gray.500",
          color: "gray.100"
        }}
        _placeholder={{
          color: "gray.500",
          _dark: { color: "gray.400" }
        }}
      />
      <InputRightElement width="4.5rem">
        <Button 
          h="1.75rem" 
          size="sm" 
          onClick={handleClick}
          variant="ghost"
          _dark={{
            color: "gray.300",
            _hover: { bg: "gray.600" }
          }}
        >
          {show ? <FaEyeSlash/> : <FaEye/> }
        </Button>
      </InputRightElement>
    </InputGroup>
    </>
  );
}
