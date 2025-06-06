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
          type={show ? "text" : "password"}
          value={setvalue}
          onChange={handleonvalue}
          border={"1px solid #b8b8b8cc"}
          onKeyDownCapture={(e) => {
            if (e.key === "Enter") {
              envClick();
            }
          }}
        />
        <InputRightElement width="4.5rem">
          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? <FaEyeSlash /> : <IoEyeSharp />}
          </Button>
        </InputRightElement>
      </InputGroup>
    </>
  );
};
