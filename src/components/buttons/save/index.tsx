import { Button, ButtonProps } from "@chakra-ui/react";

interface BtnBasicProps extends ButtonProps {
  children: React.ReactNode;
}
export default function BtnBasicSave({ children, ...props }: BtnBasicProps) {
  return <Button {...props}>{children}</Button>;
}
