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
  
  // Cores dinâmicas baseadas no tema
  const inputBg = useColorModeValue("white", "gray.700");
  const inputBorder = useColorModeValue("#E2E8F0", "gray.600");
  const inputHoverBorder = useColorModeValue("#CBD5E0", "gray.500");
  const inputFocusBorder = useColorModeValue("#3182CE", "blue.400");
  const iconColor = useColorModeValue("#718096", "gray.400");
  const iconHoverBg = useColorModeValue("gray.100", "gray.600");
  const iconHoverColor = useColorModeValue("#2D3748", "gray.200");

  return (
    <>
      <InputGroup size="lg">
        <Input 
          pr="4.5rem"
          height="48px"
          type={show ? "text" : "password"}
          value={setvalue}
          onChange={handleonvalue}
          border="2px solid"
          borderColor={inputBorder}
          borderRadius="8px"
          fontSize="16px"
          bg={inputBg}
          placeholder="Digite sua senha"
          _hover={{ 
            borderColor: inputHoverBorder
          }}
          _focus={{ 
            borderColor: inputFocusBorder,
            boxShadow: `0 0 0 1px ${inputFocusBorder}`
          }}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              envClick();
            }
          }}
        />
        <InputRightElement width="4.5rem" height="48px">
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
            borderRadius="6px"
          >
            {show ? <FaEyeSlash /> : <IoEyeSharp />}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
