"use client";
import useHomeContex from "@/hook/useHomeContex";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaListOl } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

interface BtnListNowProps {
  session: SessionNext.Client;
}

export const BtnListNow = ({ session }: BtnListNowProps) => {
  const [loading, setLoading] = useState(false);
  const [Cont, setCont] = useState(0);
  const { setData } = useHomeContex();

  const GetContNow = async () => {
    if (session.role?.now) {
      const url = "/api/alertanow/list/cont";
      const req = await fetch(url);
      const res = await req.json();
      if (req.ok) {
        setCont(res);
      }
    }
  };

  const HandleFetchNow = async () => {
    if (session.role?.now) {
      setLoading(true);
      const url = "/api/alertanow/list";
      const req = await fetch(url);
      const res = await req.json();
      if (req.ok) {
        setData(res);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    GetContNow();
  }, []);
  return (
    <Button
      leftIcon={<FaListOl />}
      colorScheme="yellow"
      variant="solid"
      w="full"
      onClick={HandleFetchNow}
      isLoading={loading}
      spinner={<BeatLoader size={8} color="white" />}
    >
      Listar Now {Cont}
    </Button>
  );
};
