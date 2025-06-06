"use client";
import { Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { HiOutlineLogout } from "react-icons/hi";

export default function BotaoSair() {
  const router = useRouter();

  const HandleSair = async (e: any) => {
    e.preventDefault();
    router.push("/login");
  };

  return (
    <Button
      textColor={"white"}
      variant="link"
      size="sm"
      leftIcon={<HiOutlineLogout />}
      onClick={HandleSair}
    >
      SAIR
    </Button>
  );
}
