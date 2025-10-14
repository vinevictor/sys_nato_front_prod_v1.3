'use client'
import useHomeContex from "@/hook/useHomeContex";
import { Button } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaListOl } from "react-icons/fa";
import { BeatLoader } from "react-spinners";

// TODO remover compoment
export const BtnListNow = () => {
  const [loading, setLoading] = useState(false)
  const [Cont, setCont] = useState(0)
  const {setData} = useHomeContex()

    const GetContNow = async () => {
      const url = '/api/alertanow/list/cont';
      const req = await fetch(url)
      const res = await req.json()
      if (req.ok) {
        setCont(res)
      }
    }

    const HandleFetchNow = async () => {
      setLoading(true)
      const url = '/api/alertanow/list';
      const req = await fetch(url)
      const res = await req.json()
      if (req.ok) {
        setData(res)
      }
      setLoading(false)
    }

    useEffect(() => {
      GetContNow()
    }, [])
    return (
        <Button
            leftIcon={<FaListOl />}
            colorScheme="yellow"
            variant="solid"
            onClick={HandleFetchNow}
            isLoading={loading}
            spinner={<BeatLoader size={8} color="white" />}
        >
            Listar Now {Cont}
        </Button>
    );
};