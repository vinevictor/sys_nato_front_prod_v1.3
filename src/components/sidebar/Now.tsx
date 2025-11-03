"use client";

import {
  Box,
  Button,
  HStack,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Badge,
  Spinner,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Flex,
  Portal,
  Avatar,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiAlertCircle, FiClock, FiUser } from "react-icons/fi";
import { Session } from "@/types/session";

/**
 * Interface para props do componente
 */
interface NowButtonProps {
  session: Session.AuthUser;
}

/**
 * Interface para um alerta NOW
 */
interface AlertaNow {
  id: number;
  nome: string;
  dt_criacao_now: string;
  alertanow: string;
  corretor: {
      id: number;
      nome: string;
  };
}

/**
 * Componente de Menu Lista Now
 *
 * Funcionalidades:
 * - Busca e exibe contador de alertas NOW
 * - Menu dropdown com lista de alertas
 * - Visual consistente com o padrão da sidebar
 * - Suporte a tema claro/escuro
 * - Badge com contador de alertas
 * - Loading state durante requisições
 * - Auto-refresh a cada 30 segundos
 *
 * @component
 */
export default function NowButton({ session }: NowButtonProps) {
  const [loading, setLoading] = useState(false);
  const [cont, setCont] = useState(0);
  const [alertas, setAlertas] = useState<AlertaNow[]>([]);

  // Cores dinâmicas baseadas no tema
  const bgButton = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const hoverBg = useColorModeValue("gray.50", "gray.600");
  const menuBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("#023147", "gray.100");
  const subtextColor = useColorModeValue("gray.600", "gray.400");

  /**
   * Busca o contador de alertas NOW
   */
  const getContNow = async () => {
    if (session?.role?.now) {
      try {
        const url = "/api/alertanow/list/cont";
        const req = await fetch(url);
        const res = await req.json();
        if (req.ok) {
          setCont(res);
        }
      } catch (error) {
        console.error("Erro ao buscar contador NOW:", error);
      }
    }
  };

  /**
   * Busca a lista completa de alertas NOW
   */
  const handleFetchNow = async () => {
    if (session?.role?.now) {
      setLoading(true);
      try {
        const url = "/api/alertanow/list";
        const req = await fetch(url);
        const res = await req.json();
        
        // Debug: mostra o formato da resposta
        console.log("Resposta da API NOW:", res);
        console.log("É array?", Array.isArray(res));
        
        if (req.ok) {
          // Garante que sempre seja um array
          if (Array.isArray(res)) {
            setAlertas(res);
          } else if (res && typeof res === 'object') {
            // Se retornar um objeto com propriedade data ou items
            setAlertas(res.data);
          } else {
            console.warn("Formato de resposta inesperado:", res);
            setAlertas([]);
          }
        }
      } catch (error) {
        console.error("Erro ao buscar lista NOW:", error);
        setAlertas([]);
      } finally {
        setLoading(false);
      }
    }
  };

  const formataData = (data: string) => {
    const dataFormatada = new Date(data);
    return `${dataFormatada.toLocaleDateString("pt-BR")} - ${dataFormatada.toLocaleTimeString('pt-BR', { hour12: false })}`;
  };


  // Carrega o contador ao montar o componente
  useEffect(() => {
    getContNow();
    // Atualiza o contador a cada 30 segundos
    const interval = setInterval(getContNow, 30000);
    return () => clearInterval(interval);
  }, [session]);

  // Não renderiza se o usuário não tiver permissão
  if (!session?.role?.now) {
    return null;
  }

  return (
    <Menu placement="right-start" isLazy onOpen={handleFetchNow}>
      <MenuButton
        as={Button}
        w="full"
        h="auto"
        p={2}
        bg={bgButton}
        border="1px"
        borderColor={borderColor}
        borderRadius="lg"
        _hover={{
          bg: hoverBg,
          borderColor: "#FB8501",
        }}
        _active={{
          bg: hoverBg,
        }}
        transition="all 0.2s ease"
        position="relative"
      >
        <HStack spacing={3} w="full">
          {/* Ícone de alerta com badge */}
          <Box position="relative">
            <Icon
              as={FiAlertCircle}
              fontSize="20"
              color={cont > 0 ? "#FB8501" : textColor}
              transition="all 0.2s"
            />
            {cont > 0 && (
              <Badge
                position="absolute"
                top="-6px"
                right="-6px"
                colorScheme="orange"
                borderRadius="full"
                fontSize="10px"
                minW="18px"
                h="18px"
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                {cont > 99 ? "99+" : cont}
              </Badge>
            )}
          </Box>

          {/* Texto */}
          <VStack align="start" spacing={0} flex={1}>
            <Text fontSize="sm" fontWeight="medium" color={textColor}>
              Lista Now
            </Text>
          </VStack>
        </HStack>
      </MenuButton>

      <Portal>
        <MenuList
          bg={menuBg}
          borderColor={borderColor}
          borderRadius="xl"
          boxShadow="2xl"
          w="380px"
          maxH="calc(68px + (5 * 90px))"
          overflowY="auto"
          zIndex={9999}
          p={0}
          sx={{
            "&::-webkit-scrollbar": {
              width: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: borderColor,
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#FB8501",
            },
          }}
        >
          {/* Header */}
          <Flex
            p={4}
            borderBottom="1px"
            borderColor={borderColor}
            justify="space-between"
            align="center"
          >
            <HStack>
              <Icon as={FiAlertCircle} color="#FB8501" fontSize="20" />
              <Text fontSize="md" fontWeight="bold" color={textColor}>
                Alertas NOW
              </Text>
            </HStack>
            {cont > 0 && (
              <Badge colorScheme="orange" fontSize="xs" px={2} py={1}>
                {cont} {cont === 1 ? "alerta" : "alertas"}
              </Badge>
            )}
          </Flex>

          {/* Loading state */}
          {loading ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={12}
              px={4}
            >
              <Spinner size="lg" color="#FB8501" mb={3} />
              <Text fontSize="sm" color={textColor} fontWeight="medium">
                Carregando alertas...
              </Text>
            </Flex>
          ) : alertas.length === 0 ? (
            // Estado vazio
            <Flex
              direction="column"
              align="center"
              justify="center"
              py={12}
              px={4}
            >
              <Icon
                as={FiAlertCircle}
                fontSize="48"
                color={subtextColor}
                mb={3}
              />
              <Text fontSize="sm" color={textColor} fontWeight="medium">
                Nenhum alerta NOW
              </Text>
              <Text fontSize="xs" color={subtextColor} textAlign="center">
                Tudo tranquilo por aqui!
              </Text>
            </Flex>
          ) : (
            // Lista de alertas
            <Box>
              {alertas.map((alerta, index) => (
                <Box key={alerta.id}>
                  <MenuItem
                    bg={"transparent"}
                    _hover={{ bg: hoverBg }}
                    py={3}
                    px={4}
                  >
                    <HStack spacing={3} align="start" w="full">
                      {/* Avatar com indicador de prioridade */}
                      <Avatar
                        size="sm"
                        icon={<Icon as={FiAlertCircle} fontSize="18" />}
                        bg={"yellow"}
                        color="black"
                      />

                      {/* Conteúdo */}
                      <VStack align="start" spacing={1} flex={1}>
                        <HStack justify="space-between" w="full">
                          <Text
                            fontSize="sm"
                            fontWeight="bold"
                            color={textColor}
                            noOfLines={1}
                          >
                            {alerta.nome}
                          </Text>
                          <Badge colorScheme={"yellow"} fontSize="xs">
                            alta
                          </Badge>
                        </HStack>
                        <HStack spacing={3} fontSize="xs" color={subtextColor}>
                          <HStack spacing={1}>
                            <Icon as={FiUser} />
                            <Text>{alerta.corretor.nome}</Text>
                          </HStack>
                          <HStack spacing={1}>
                            <Icon as={FiClock} />
                            <Text>{formataData(alerta.dt_criacao_now)}</Text>
                          </HStack>
                        </HStack>
                      </VStack>
                    </HStack>
                  </MenuItem>
                  {index < alertas.length - 1 && <MenuDivider m={0} />}
                </Box>
              ))}
            </Box>
          )}
        </MenuList>
      </Portal>
    </Menu>
  );
}
