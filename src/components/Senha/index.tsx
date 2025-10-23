import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import {  useState } from "react";
import { FaEyeSlash } from "react-icons/fa";
import { IoEyeSharp } from "react-icons/io5";

interface SenhaProps {
  onvalue: any;
  setvalue: string;
  envClick?: any;
}

export const SenhaComponent = ({ setvalue, onvalue, envClick }: SenhaProps) => {
  // function PasswordInput()
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const handleonvalue = (e: any) => {
    e.preventDefault();
    const value: string = e.target.value;
    onvalue(value);
  };
  
  // Cores dinâmicas baseadas no tema (padrão do sistema)
  const inputBg = useColorModeValue("white", "gray.800");
  const inputBorder = useColorModeValue("gray.300", "gray.600");
  const inputHoverBorder = useColorModeValue("#00713D", "green.500");
  const inputFocusBorder = useColorModeValue("#00713D", "green.500");
  const iconColor = useColorModeValue("gray.600", "gray.400");
  const iconHoverBg = useColorModeValue("green.50", "green.900");
  const iconHoverColor = useColorModeValue("#00713D", "green.400");

  return (
    <>
      <InputGroup size="lg">
        <Input
          pr="4.5rem"
          type={show ? "text" : "password"}
          value={setvalue}
          onChange={handleonvalue}
          bg={inputBg}
          borderColor={inputBorder}
          placeholder="Digite sua senha"
          _hover={{
            borderColor: inputHoverBorder
          }}
          _focus={{
            borderColor: inputFocusBorder,
            boxShadow: `0 0 0 1px ${inputFocusBorder}`
          }}
          _dark={{ bg: "gray.800", borderColor: "gray.600" }}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              envClick();
            }
          }}
        />
        <InputRightElement width="4.5rem">
          <Button
            h="32px"
            size="sm"
            onClick={handleClick}
            bg="transparent"
            color={iconColor}
            _hover={{
              bg: iconHoverBg,
              color: iconHoverColor
            }}
            borderRadius="md"
            transition="all 0.2s"
          >
            {show ? <FaEyeSlash /> : <IoEyeSharp />}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
