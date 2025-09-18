import {
  Input,
  InputGroup,
  InputRightElement,
  Button,
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
  // function PasswordInput() {
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  const handleonvalue = (e: any) => {
    e.preventDefault();
    const value: string = e.target.value;
    onvalue(value);
  };

  return (
    <>
      <InputGroup size="lg">
        <Input 
          pr="4.5rem"
          height="48px"
          type={show ? "text" : "password"}
          value={setvalue}
          onChange={handleonvalue}
          border="2px solid #E2E8F0"
          borderRadius="8px"
          fontSize="16px"
          bg="white"
          placeholder="Digite sua senha"
          _hover={{ 
            borderColor: "#CBD5E0" 
          }}
          _focus={{ 
            borderColor: "#3182CE",
            boxShadow: "0 0 0 1px #3182CE"
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
            color="#718096"
            _hover={{ 
              bg: "gray.100",
              color: "#2D3748"
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
