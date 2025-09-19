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
import { GiBrazil } from "react-icons/gi";
import BotaoMenu from "../bt_menu";
import BotaoMobileMenu from "../bt_mobile_menu";
import { FaSignature } from "react-icons/fa";

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
      alignItems={"center"}
      bg={"#00713D"}
      px={{ base: "8", md: "10" }}
      minH="70px" // Garante altura mínima para evitar layout shift
    >
      {/* Coluna: Logo (sempre presente) */}
      <Box minW={"100px"} w={"112px"}>
        <Img src="/SisnatoLogoL.png" alt="Logo" width={"100%"} />
      </Box>

      {/* Coluna: Navegação principal (estrutura sempre presente, conteúdo condicional) */}
      <Box display={{ base: "flex", md: "none" }}>
        {session ? (
          <Menu>
            <MenuButton
              bg={"gray.50"}
              as={IconButton}
              aria-label="Options"
              icon={<RxHamburgerMenu />}
              variant="outline"
            />
            <MenuList>
              <BotaoMobileMenu name="Home" path="/home" icon={<FiHome />} />
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
                  <BotaoMobileMenu name="Direto" path="/direto" icon={<CgBriefcase />} />
                )} */}
              <BotaoMobileMenu name="Sair" path="/login" icon={<FiLogOut />} />
            </MenuList>
          </Menu>
        ) : (
          // Placeholder para manter a forma do DOM durante SSR
          <Box aria-hidden="true" />
        )}
      </Box>

      <Box display={{ base: "none", md: "flex" }} gap={1} w={"85%"}>
        {session ? (
          <>
            <BotaoMenu name="Home" path="/home" icon={<FiHome />} />
            <BotaoMenu
              name="Nova Solicitação"
              path="/solicitacoes"
              icon={<FiFilePlus />}
            />
            {session?.role?.adm && (
              <BotaoMenu name="Painel adm" path="/adm" icon={<FiSettings />} />
            )}
            <BotaoMenu
              name="Dashboard"
              path="/dashboard"
              icon={<LuLayoutDashboard />}
            />
            <BotaoMenu name="FAQ" path="/faq" icon={<CgToday />} />
            {session?.role?.direto && (
              <BotaoMenu name="Direto" path="/direto" icon={<CgBriefcase />} />
            )}
            {session?.role?.adm && (
              <BotaoMenu
                name="NatoGov (desenvolvimento)"
                path="/natogov"
                icon={<GiBrazil />}
              />
            )}
            {session?.role?.adm && (
              <BotaoMenu
                name="NatoSign (IntelliSign)"
                path="/natosign"
                icon={<FaSignature />}
              />
            )}
          </>
        ) : (
          // Placeholder para manter a forma do DOM durante SSR
          <Box aria-hidden="true" />
        )}
      </Box>

      {/* Coluna: Ações à direita (estrutura sempre presente) */}
      <Box display={{ base: "none", md: "flex" }}>
        {session ? (
          <BotaoMenu name="Sair" path="/login" icon={<FiLogOut />} />
        ) : (
          <Box aria-hidden="true" />
        )}
      </Box>
    </Flex>
  );
}
