"use client";
import { SessionServer } from "@/types/session";
import {
  Box,
  Flex,
  IconButton,
  Img,
  Menu,
  MenuButton,
  MenuList,
} from "@chakra-ui/react";
import { CgBriefcase, CgToday } from "react-icons/cg";
import { FiFilePlus, FiHome, FiLogOut, FiSettings } from "react-icons/fi";
import { LuLayoutDashboard } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";
import BotaoMenu from "../bt_menu";
import BotaoMobileMenu from "../bt_mobile_menu";

/**
 * Interface para tipagem das props do componente BotaoJuncao.
 * session: informações da sessão do usuário, podendo ser nulo.
 */
interface BotoesFunctionProps {
  session: SessionNext.Client;
}
// Clean Code: Sempre renderize o container principal para evitar erro de hidratação
// e garantir uma estrutura consistente entre server e client.
export default function BotaoJuncao({ session }: BotoesFunctionProps) {
  return (
    <Flex
      justifyContent={"space-between"}
      py={3}
      w={"100%"}
      bg={"#00713D"}
      px={40}
      minH="70px" // Garante altura mínima para evitar layout shift
    >
      {session ? (
        <>
          <Flex gap={10} alignItems={"center"}>
            <Box minW={"100px"} w={"112px"}>
              <Img src="/SisnatoLogoL.png" alt="Logo" width={"100%"} />
            </Box>
            <Box display={{ base: "flex", md: "none" }}>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label="Options"
                  icon={<RxHamburgerMenu />}
                  variant="outline"
                />
                <MenuList>
                  <BotaoMobileMenu name="Home" path="/" icon={<FiHome />} />
                  <BotaoMobileMenu
                    name="Nova Solicitação"
                    path="/solicitacoes"
                    icon={<FiFilePlus />}
                  />
                  {session?.role?.adm && (
                    <BotaoMobileMenu
                      name="Painel adm"
                      path="/adm"
                      icon={<FiSettings />}
                    />
                  )}
                  <BotaoMobileMenu
                    name="Dashboard"
                    path="/dashboard"
                    icon={<LuLayoutDashboard />}
                  />
                  <BotaoMobileMenu name="FAQ" path="/faq" icon={<CgToday />} />
                  {/* {session?.role?.direto && (
                    <BotaoMobileMenu
                      name="Direto"
                      path="/direto"
                      icon={<CgBriefcase />}
                    />
                  )} */}
                  <BotaoMobileMenu
                    name="Sair"
                    path="/login"
                    icon={<FiLogOut />}
                  />
                </MenuList>
              </Menu>
            </Box>
            <Box display={{ base: "none", md: "flex" }} gap={1} w={"85%"}>
              <BotaoMenu name="Home" path="/" icon={<FiHome />} />
              <BotaoMenu
                name="Nova Solicitação"
                path="/solicitacoes"
                icon={<FiFilePlus />}
              />
              {session?.role?.adm && (
                <BotaoMenu
                  name="Painel adm"
                  path="/adm"
                  icon={<FiSettings />}
                />
              )}
              <BotaoMenu
                name="Dashboard"
                path="/dashboard"
                icon={<LuLayoutDashboard />}
              />
              <BotaoMenu name="FAQ" path="/faq" icon={<CgToday />} />
              {session?.role?.direto && (
                <BotaoMenu
                  name="Direto"
                  path="/direto"
                  icon={<CgBriefcase />}
                />
              )}
            </Box>
          </Flex>
        </>
      ) : (
        // Placeholder vazio para manter a estrutura do DOM e evitar erro de hidratação
        <Box w="100%" />
      )}
      <Box display={{ base: "none", md: "flex" }}>
        <BotaoMenu name="Sair" path="/login" icon={<FiLogOut />} />
      </Box>
    </Flex>
  );
}
