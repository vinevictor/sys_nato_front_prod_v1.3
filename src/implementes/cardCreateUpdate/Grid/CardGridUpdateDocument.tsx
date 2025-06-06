import {
  Box,
  BoxProps,
  Flex,
  FormLabel,
  Text,
} from "@chakra-ui/react";
import InputUpdateCnh from "../imputs/inputUpdateCnh";
import { ButtonsDownloadsCnh } from "../butons/butonsDowloadsCnh";

interface CardGridUpdateCnhProps extends BoxProps {
  Url: string;
  tag: string;
  Hierarquia: string;
  suspenso: string;
}

export default async function CardGridUpdateDocument({
  Url,
  tag,
  Hierarquia,
  suspenso,
  ...props
}: CardGridUpdateCnhProps) {

  return (
    <>
      <Box {...props}>
        <FormLabel fontSize="sm" fontWeight="md" m={0}>
          <Flex>
          {tag} {Url && (
            <Text ms={3} color={"green.400"} fontSize={"0.7rem"}>{tag} ja esta adicionado</Text>
          )}
          </Flex>
        </FormLabel>
        <InputUpdateCnh
          Url={Url}
          tag={tag}
          px={1}
          bg={"gray.100"}
          borderColor={"gray.400"}
        />
        {Hierarquia !== "USER" && (suspenso ? <Text color={'red'}>{suspenso}</Text> : <ButtonsDownloadsCnh url={Url} />)}
      </Box>
    </>       
  );
}
