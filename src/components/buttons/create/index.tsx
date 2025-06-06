import { Button } from "@chakra-ui/react";
import { useState } from "react";

interface BasicBtnCreateProps {
  children: React.ReactNode;
  id: number;
}
export default function BasicModalBtnCreate({
  id,
  children,
  ...props
}: BasicBtnCreateProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Button {...props} onClick={() => setIsOpen(true)}>
      {children}
    </Button>
  );
}
