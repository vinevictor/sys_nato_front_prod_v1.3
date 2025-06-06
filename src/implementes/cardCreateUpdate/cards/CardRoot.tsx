import { Box } from "@chakra-ui/react";


interface CardRootProps {
  children: React.ReactNode;
}
export function CardRoot({ children }: CardRootProps) {
  return (
    <>
      <Box
        w={{ base: "95%", md: "65%" }}
        p={6}
        bg="white"
        borderRadius={8}
        boxShadow="2xl"
        mb={12}
      >
        {children}
      </Box>
    </>
  );
}
