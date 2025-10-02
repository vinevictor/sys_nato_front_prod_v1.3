import {
  FormControl,
  FormLabel,
  Select,
  VStack,
  InputGroup,
  InputLeftElement,
  Input,
  Skeleton,
  Text,
  Heading,
} from "@chakra-ui/react";

interface CcaType {
  id: number;
  fantasia: string;
  valor: number;
}

interface ConstType {
  id: number;
  fantasia: string;
}

interface Step1Props {
  formData: any;
  setFormData: (data: any) => void;
  handleCcaChange: (ccaId: string) => void;
  availableCcas: CcaType[];
  isCcaLoading: boolean;
  isConstLoading: boolean;
  availableConst: ConstType[];
}

export default function Step1({
  formData,
  handleCcaChange,
  setFormData,
  availableCcas,
  isCcaLoading,
  isConstLoading,
  availableConst,
}: Step1Props) {
  const handleChange = (field: string, value: string) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };
  const renderCcaComponent = () => {
    if (isCcaLoading) {
      return <Skeleton height="40px" borderRadius="md" />;
    }

    if (availableCcas.length > 1) {
      return (
        <Select
          placeholder="Selecione um CCA"
          value={formData.cca_id}
          onChange={(e) => handleCcaChange(e.target.value)}
          isRequired
        >
          {availableCcas.map((cca) => (
            <option key={cca.id} value={cca.id.toString()}>
              {cca.fantasia}
            </option>
          ))}
        </Select>
      );
    }

    if (availableCcas.length === 1) {
      return (
        <Text
          fontSize="md"
          p={2}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
        >
          <strong>{availableCcas[0].fantasia}</strong> (selecionado
          automaticamente)
        </Text>
      );
    }

    return (
      <Text color="red.500" p={2}>
        Nenhum CCA disponível para esta operação.
      </Text>
    );
  };
  const renderConstComponent = () => {
    if (isConstLoading) {
      return <Skeleton height="40px" borderRadius="md" />;
    }
    if (availableConst.length > 1) {
      return (
        <Select
          placeholder="Selecione a construtora"
          value={formData.const_id}
          onChange={(e) => handleChange("const_id", e.target.value)}
          isRequired
        >
          {availableConst.map((c) => (
            <option key={c.id} value={c.id.toString()}>
              {c.fantasia}
            </option>
          ))}
        </Select>
      );
    }
    if (availableConst.length === 1) {
      return (
        <Text
          fontSize="md"
          p={2}
          borderWidth="1px"
          borderRadius="md"
          bg="gray.50"
        >
          <strong>{availableConst[0].fantasia}</strong> (selecionado
          automaticamente)
        </Text>
      );
    }
    return (
      <Text color="red.500" p={2}>
        Nenhuma construtora disponível.
      </Text>
    );
  };

  return (
    <VStack spacing={6} align="stretch">
      <FormControl isRequired>
        <FormLabel>Tipo de Assinatura</FormLabel>
        <Select
          placeholder="Selecione o tipo de assinatura"
          value={formData.signatureType}
          onChange={(e) => handleChange("signatureType", e.target.value)}
        >
          <option value="simple">Simples</option>
          <option value="qualified">
            Qualificada (com Certificado Digital)
          </option>
        </Select>
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Financeira (CCA)</FormLabel>
        {renderCcaComponent()}
      </FormControl>
      <FormControl isRequired>
        <FormLabel>Construtora</FormLabel>
        {renderConstComponent()}
      </FormControl>
    </VStack>
  );
}
