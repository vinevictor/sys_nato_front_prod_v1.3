import BotaoAdm from "@/components/botoes/bt_adm";
import { GetSessionServer } from "@/lib/auth_confg";
import { Box, Divider, Flex, Text } from "@chakra-ui/react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "PAINEL ADMINISTRATIVO",
};

export default async function PainelAdmLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await GetSessionServer();
  
  return (
    <>
      <Flex
        w={"100%"}
        h={"100%"}
        p={{ base: 0, md: 3 }}
        pt={{ base: 3, md: 3 }}
        gap={{ base: 0, md: 3 }}
        justifyContent={"space-between"}
        flexDir={{ base: "column", md: "row" }}
      >
    
        <Flex
          w={{ 
            base: "60px", 
            sm: "100%",  
            md: "250px",  
          }}
          minW={{ 
            base: "60px", 
            sm: "200px", 
            md: "250px"
          }}
          maxW={{ 
            base: "60px", 
            sm: "100%", 
            md: "250px" 
          }}
          h={{ base: "auto", md: "100%" }}
          flexDir={"column"}
          flexShrink={0} 
          bg={{ base: "transparent", md: "gray.50" }}
          borderRadius={{ base: 0, md: "md" }}
          p={{ base: 1, sm: 2, md: 3 }}
        >

          <Box 
            w={"100%"}
            display={{ base: "none", sm: "block" }} 
          >
            <Text 
              color={"gray.400"} 
              fontSize={{ sm: "lg", md: "xl" }}
              textAlign={"center"}
            >
              Gerenciamento
            </Text>
          </Box>
          
          <Divider
            my={4}
            borderColor={"gray.300"}
            w={"100%"}
            display={{ base: "none", sm: "block" }} 
          />
          
          
          <Flex
            flexDir={{ base: "column", sm: "row", md: "column" }}
            w={"100%"}
            gap={{ base: 1, sm: 2, md: 2 }}
            flexWrap={{ base: "nowrap", sm: "wrap", md: "nowrap" }}
            justifyContent={{ base: "flex-start", sm: "flex-start", md: "flex-start" }}
            alignItems={{ base: "stretch", sm: "flex-start", md: "stretch" }}
            overflowX={{ base: "visible", sm: "auto", md: "visible" }}
            overflowY={{ base: "auto", sm: "visible", md: "auto" }}
          >
            {session?.user.role?.user && <BotaoAdm name={"Usuarios"} />}
            {session?.user.role?.empreendimento && <BotaoAdm name={"Empreendimentos"} />}
            {session?.user.role?.construtora && <BotaoAdm name={"Construtora"} />}
            {session?.user.hierarquia === "ADM" && <BotaoAdm name={"CCAs"} />}
            {session?.user.hierarquia === "ADM" && <BotaoAdm name={"Tags"} />}
          </Flex>
        </Flex>
        
        
        <Flex 
          w={{ 
            base: "calc(100% - 60px)", 
            sm: "100%", 
            md: "calc(100% - 250px)" 
          }} 
          minW={0}
          h={"full"}
          flex={1}
          overflow="hidden"
        >
          <Box w="100%" h="100%" overflow="auto">
            {children}
          </Box>
        </Flex>
      </Flex>
    </>
  );
}