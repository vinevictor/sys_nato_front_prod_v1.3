"use client";

import {
  SimpleGrid,
  Box,
  Input,
  Select,
  Button,
  Text,
  VStack,
  HStack,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaFilter, FaSearch } from "react-icons/fa";
import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AnalyticsFilters({ currentFilters, lists }: any) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPending, startTransition] = useTransition();

  const [tempFilters, setTempFilters] = useState({
    startDate: currentFilters.startDate || "2026-04-01",
    endDate: currentFilters.endDate || "2026-04-30",
    construtoraId: currentFilters.construtoraId || "",
    financeiroId: currentFilters.financeiroId || "",
  });

  const handleApply = () => {
    const params = new URLSearchParams();

    if (tempFilters.startDate) params.set("startDate", tempFilters.startDate);
    if (tempFilters.endDate) params.set("endDate", tempFilters.endDate);
    if (tempFilters.construtoraId)
      params.set("construtoraId", tempFilters.construtoraId);
    if (tempFilters.financeiroId)
      params.set("financeiroId", tempFilters.financeiroId);

    const newUrl = `/analytics?${params.toString()}`;

    startTransition(() => {
      router.push(newUrl);
    });
  };

  const bg = useColorModeValue("white", "rgba(23, 25, 35, 0.6)");

  return (
    <Box
      bg={bg}
      p={6}
      borderRadius="24px"
      shadow="sm"
      border="1px solid"
      borderColor={useColorModeValue("gray.100", "whiteAlpha.100")}
      backdropFilter="blur(10px)"
    >
      <VStack align="stretch" spacing={4}>
        <HStack>
          <Icon as={FaFilter} color="green.500" />
          <Text
            fontWeight="bold"
            fontSize="xs"
            letterSpacing="widest"
            color="gray.500"
          >
            FILTROS DE PERFORMANCE
          </Text>
        </HStack>

        <SimpleGrid columns={{ base: 1, md: 2, lg: 5 }} spacing={4}>
          <Box>
            <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
              DATA INICIAL
            </Text>
            <Input
              type="date"
              size="sm"
              borderRadius="lg"
              value={tempFilters.startDate}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, startDate: e.target.value })
              }
            />
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
              DATA FINAL
            </Text>
            <Input
              type="date"
              size="sm"
              borderRadius="lg"
              value={tempFilters.endDate}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, endDate: e.target.value })
              }
            />
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
              CONSTRUTORA
            </Text>
            <Select
              size="sm"
              borderRadius="lg"
              placeholder="Todas as Construtoras"
              value={tempFilters.construtoraId}
              onChange={(e) =>
                setTempFilters({
                  ...tempFilters,
                  construtoraId: e.target.value,
                })
              }
            >
              {lists.construtoras.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.fantasia || c.nome}
                </option>
              ))}
            </Select>
          </Box>

          <Box>
            <Text fontSize="xs" fontWeight="bold" mb={1} color="gray.500">
              CCA / FINANCEIRA
            </Text>
            <Select
              size="sm"
              borderRadius="lg"
              placeholder="Todas as Financeiras"
              value={tempFilters.financeiroId}
              onChange={(e) =>
                setTempFilters({ ...tempFilters, financeiroId: e.target.value })
              }
            >
              {lists.financeiras.map((f: any) => (
                <option key={f.id} value={f.id}>
                  {f.fantasia || f.nome}
                </option>
              ))}
            </Select>
          </Box>

          <Box display="flex" alignItems="flex-end">
            <Button
              w="full"
              size="sm"
              colorScheme="green"
              borderRadius="lg"
              leftIcon={<FaSearch />}
              isLoading={isPending}
              onClick={handleApply}
            >
              Aplicar Filtros
            </Button>
          </Box>
        </SimpleGrid>
      </VStack>
    </Box>
  );
}
