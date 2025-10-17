import useEmpreendimentoContext from "@/hook/useEmpreendimentoContext";
import { Box, Button, Flex, Icon, Input, Select, SelectProps, Text, chakra } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { BeatLoader } from "react-spinners";

interface FinanceiraType {
  id: number;
  fantasia: string;
}

interface SelectEmpreendimentoFinanceiroProps extends SelectProps {
  setValue: FinanceiraType[];
  financeirasList: FinanceiraType[];
  OutValue?: (ids: number[]) => void;
}


/**
 * Componente para seleção e gerenciamento de financeiras vinculadas ao empreendimento.
 * Permite adicionar múltiplas financeiras através de um select e exibe tags com as selecionadas.
 * 
 * @param setValue - Array de objetos financeiras iniciais [{id, fantasia}]
 * @param financeirasList - Lista completa de financeiras disponíveis para seleção
 * @param OutValue - Callback opcional que recebe array de IDs [1, 2, 3] quando há alterações
 * 
 * RETORNO:
 * - Via OutValue: função callback recebe array de números [1, 2, 3]
 * - Via Contexto: setFinanceiraCX também recebe o array de IDs (compatibilidade)
 * - Atualizado automaticamente a cada adição/remoção
 * 
 * FLUXO:
 * 1. Inicialização: setValue → financeirasSelecionadasDetalhes (objetos completos)
 * 2. Exibição: Renderiza tags com base em financeirasSelecionadasDetalhes
 * 3. Adicionar: ID do select → Busca em financeirasList → Adiciona objeto
 * 4. Remover: Clica no X → Remove objeto da lista
 * 5. Sincronização: useEffect → Converte para IDs → Chama OutValue([1,2,3])
 */
export function FinanceiraEmpreendimento({ setValue, financeirasList, OutValue, ...props }: SelectEmpreendimentoFinanceiroProps) {
  const [financeiraId, setFinanceiraId] = useState<number | undefined>();
  const [financeirasSelecionadasDetalhes, setFinanceirasSelecionadasDetalhes] = useState<FinanceiraType[]>(
    Array.isArray(setValue) ? setValue.filter(f => f && f.id && f.fantasia) : []
  );
  const [isLoading, setIsLoading] = useState(false);
  const { setFinanceiraCX } = useEmpreendimentoContext();

  /**
   * Inicializa as financeiras selecionadas com base no setValue
   */
  useEffect(() => {
    if (Array.isArray(setValue) && setValue.length > 0) {
      // Filtra apenas objetos válidos com id e fantasia
      const validas = setValue.filter(f => f && typeof f === 'object' && f.id && f.fantasia);
      setFinanceirasSelecionadasDetalhes(validas);
    }
  }, [setValue]);

  /**
   * Adiciona uma financeira à lista de selecionadas
   * Busca o objeto completo em financeirasList pelo ID
   */
  const handleAdicionarFinanceira = () => {
    if (!financeiraId) {
      return;
    }

    // Verifica se já está selecionada
    const jaExiste = financeirasSelecionadasDetalhes.some(f => f.id === financeiraId);
    if (jaExiste) {
      return;
    }

    setIsLoading(true);
    // Busca o objeto completo em financeirasList
    const financeiraSelecionada = financeirasList.find(f => f.id === financeiraId);
    
    if (financeiraSelecionada) {
      setFinanceirasSelecionadasDetalhes([...financeirasSelecionadasDetalhes, financeiraSelecionada]);
      setFinanceiraId(undefined);
    }
    
    setIsLoading(false);
  };

  /**
   * Remove uma financeira da lista de selecionadas
   */
  const handleRemoverFinanceira = (id: number) => {
    setFinanceirasSelecionadasDetalhes(financeirasSelecionadasDetalhes.filter(f => f.id !== id));
  };


  /**
   * Sincroniza as financeiras selecionadas
   * RETORNO: Envia array de IDs [1, 2, 3]
   * - Para OutValue callback (se fornecido)
   * - Para contexto setFinanceiraCX (compatibilidade)
   */
  useEffect(() => {
    const ids = financeirasSelecionadasDetalhes.map(f => f.id);
    
    // Retorna via callback OutValue
    if (OutValue && typeof OutValue === "function") {
      OutValue(ids);
    }
    
    // Retorna via contexto (compatibilidade)
    if (setFinanceiraCX && typeof setFinanceiraCX === "function") {
      setFinanceiraCX(ids);
    }
  }, [financeirasSelecionadasDetalhes, OutValue, setFinanceiraCX]);

  return (
    <Box>
      {/* Select e botão de adicionar */}
      <Flex gap={3} mb={4}>
        <Select
          {...props}
          placeholder="Selecione uma financeira"
          bg="gray.50"
          borderColor="gray.300"
          _hover={{ borderColor: "gray.400" }}
          _focus={{
            borderColor: "green.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-green-500)",
          }}
          _dark={{
            bg: "gray.800",
            borderColor: "gray.600",
            color: "gray.100",
          }}
          isDisabled={isLoading}
          onChange={(e) => setFinanceiraId(Number(e.target.value))}
          value={financeiraId || ""}
        >
          {financeirasList.length > 0 &&
            financeirasList
              .filter(f => !financeirasSelecionadasDetalhes.some(sel => sel.id === f.id))
              .map((financeira) => (
                <chakra.option
                  _dark={{ color: "gray.700" }}
                  key={financeira.id}
                  value={financeira.id}
                >
                  {financeira.fantasia}
                </chakra.option>
              ))}
        </Select>
        <Button
          colorScheme="green"
          leftIcon={<FaPlus />}
          size="md"
          isLoading={isLoading}
          isDisabled={!financeiraId}
          spinner={<BeatLoader size={8} color="white" />}
          onClick={handleAdicionarFinanceira}
          flexShrink={0}
        >
          Adicionar
        </Button>
      </Flex>

      {/* Tags das financeiras selecionadas */}
      {financeirasSelecionadasDetalhes.length > 0 && (
        <Flex gap={2} flexWrap="wrap">
          {financeirasSelecionadasDetalhes.filter(f => f && f.id && f.fantasia).map((financeira) => (
            <Flex
              key={financeira.id}
              gap={2}
              px={3}
              py={1}
              alignItems="center"
              borderRadius="md"
              bg="green.100"
              borderWidth="1px"
              borderColor="green.300"
              _dark={{
                bg: "green.800",
                borderColor: "green.600",
              }}
            >
              <Text 
                fontSize="sm" 
                color="green.800"
                _dark={{ color: "green.100" }}
                fontWeight="medium"
              >
                {financeira.fantasia}
              </Text>
              <Icon
                as={RxCross2}
                fontSize="md"
                color="green.600"
                _dark={{ color: "green.300" }}
                onClick={() => handleRemoverFinanceira(financeira.id)}
                cursor="pointer"
                _hover={{
                  color: "red.500",
                  transform: "scale(1.1)",
                }}
                transition="all 0.2s"
              />
            </Flex>
          ))}
        </Flex>
      )}

      {/* Campo hidden para envio do formulário */}
      <Box hidden>
        <Input
          name="financeira"
          value={financeirasSelecionadasDetalhes.map(f => f.id).join(",")}
          readOnly
        />
      </Box>
    </Box>
  );
}