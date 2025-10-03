import {
  FormControl,
  FormLabel,
  Select,
  VStack,
  Input,
  Skeleton,
  Text,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";

interface CcaType {
  id: number;
  fantasia: string;
  Intelesign_price: number;
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
  const handleChange = (field: string, value: string | number) => {
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
        Nenhum CCA disponível.
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
        <FormLabel>Construtora</FormLabel>
        {renderConstComponent()}
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Financeira (CCA)</FormLabel>
        {renderCcaComponent()}
      </FormControl>

      <FormControl isRequired>
        <FormLabel>Tipo de Assinatura</FormLabel>
        <Select
          value={formData.signatureType}
          onChange={(e) => handleChange("signatureType", e.target.value)}
        >
          <option value="simple">Simples</option>
          <option value="qualified">Qualificada</option>
        </Select>
      </FormControl>

      <FormControl>
        <FormLabel>Título do Envelope</FormLabel>
        <Input
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Assunto do Email</FormLabel>
        <Input
          value={formData.subject}
          onChange={(e) => handleChange("subject", e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Mensagem do Email</FormLabel>
        <Textarea
          value={formData.message}
          onChange={(e) => handleChange("message", e.target.value)}
          placeholder="Mensagem que aparecerá no corpo do email para os signatários."
        />
      </FormControl>

      <FormControl>
        <FormLabel>Dias para Expiração</FormLabel>
        <NumberInput
          value={formData.expire_at}
          min={1}
          onChange={(valueAsString, valueAsNumber) =>
            handleChange("expire_at", valueAsNumber)
          }
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
    </VStack>
  );
}
