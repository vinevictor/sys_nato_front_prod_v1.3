import FooterComponent from "@/components/footer";
import PublicHeader from "@/components/public_header";
import Sidebar from "@/components/sideBar";
import { Box, Flex } from "@chakra-ui/react";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

export default function PrivateLayout({ children }: PrivateLayoutProps) {
  return (
    <Flex minW="full" minH="full" direction="column">
      <PublicHeader />
      <Flex h="full" overflowY="auto">
        <Sidebar />
        <Box flex="1" overflowY="auto">
          {children}
        </Box>
      </Flex>
      <FooterComponent />
    </Flex>
  );
}
