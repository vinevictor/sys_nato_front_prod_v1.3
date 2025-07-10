import FooterComponent from "@/components/footer";
import PublicHeader from "@/components/public_header";
import Sidebar from "@/components/sideBar";
import { Box, Flex } from "@chakra-ui/react";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <Flex w="full"h="100vh" direction="column" justifyContent="space-between">
      <PublicHeader />
      <Flex h="full" overflowY="auto">
        <Sidebar />
        <Box overflowY="auto" flex="1">
          {children}
        </Box>
      </Flex>
      <FooterComponent />
    </Flex>
  );
}
