"use client";
import { Box, Heading, Icon, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { PiNewspaperClippingDuotone } from "react-icons/pi";

interface DistratoAlertPrintProps {
  userId: number;
  userDateTime: string;
}

export default function DistratoAlertPrint({
  userId,
  userDateTime
}: DistratoAlertPrintProps) {
  const [DataUser, setDataUser] = useState<any>();
  const [DataUserName, setDataUserName] = useState<string>("");
  const [FormateDate, setFormateDate] = useState<string>("");
  const [FormateTime, setFormateTime] = useState<string>("");

  useEffect(() => {
    if (userId && userDateTime) {
      (async () => {
        const response = await fetch(`/api/usuario/getId/${userId}`);
        const data = await response.json();
        console.log(data);
        setDataUser(data);
        setDataUserName(data.nome);
      })();
      const date = new Date(userDateTime);
      const formattedDate = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()}`;
      const formattedTime = `${date.getHours()}:${date.getMinutes()}`;

      setFormateDate(formattedDate);
      setFormateTime(formattedTime);
    }
  }, [userDateTime, userId]);

  return (
    <>
      {DataUser && (
        <Box
          w={"100%"}
          bg={"gray.400"}
          borderStart={"10px solid"}
          borderColor={"gray.600"}
          ps={5}
          p={3}
        >
          <Box
            w={"100%"}
            display={"flex"}
            flexDir={"column"}
            justifyContent={"center"}
            alignItems={"center"}
            gap={2}
          >
            <Box
              bg={"gray.600"}
              borderRadius={"50%"}
              h={10}
              w={10}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              <Icon
                as={PiNewspaperClippingDuotone}
                color={"white"}
                boxSize={8}
              />
            </Box>
            <Heading size={"sm"}>Solicitação de Distrato</Heading>
          </Box>
          <Box w={"100%"} textAlign={"center"}>
            <Text fontSize={"0.9rem"}>
              Distrato efetuado por {DataUserName} no dia {FormateDate} a
              {FormateTime}
            </Text>
          </Box>
        </Box>
      )}
    </>
  );
}
