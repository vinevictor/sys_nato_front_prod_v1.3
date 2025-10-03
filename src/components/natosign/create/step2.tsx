import {
  FormControl,
  FormLabel,
  Button,
  Input,
  VStack,
  Text,
  Icon,
  Box,
  AspectRatio,
} from "@chakra-ui/react";
import { FiUpload, FiCheckCircle } from "react-icons/fi";

interface Step2Props {
  formData: any;
  setFormData: (data: any) => void;
  previewUrl: string | null;
}

export default function Step2({
  formData,
  setFormData,
  previewUrl,
}: Step2Props) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Por favor, selecione um arquivo PDF.");
        return;
      }
      setFormData((prev: any) => ({ ...prev, document: file }));
    }
  };

  return (
    <VStack spacing={6} align="stretch">
      <FormControl>
        <FormLabel>Documento para Assinatura</FormLabel>
        <Input
          type="file"
          id="file-upload"
          display="none"
          onChange={handleFileChange}
          accept=".pdf"
        />
        <Button
          as="label"
          htmlFor="file-upload"
          leftIcon={<Icon as={FiUpload} />}
          variant="outline"
          cursor="pointer"
          w="full"
        >
          Escolher Arquivo (PDF)
        </Button>
      </FormControl>

      {formData.document && (
        <Text color="green.600" display="flex" alignItems="center">
          <Icon as={FiCheckCircle} mr={2} />
          Arquivo selecionado: <strong>{formData.document.name}</strong>
        </Text>
      )}
      {previewUrl && (
        <Box>
          <FormLabel>Documento</FormLabel>
          <AspectRatio ratio={4 / 5} maxH="500px">
            <iframe
              title="Pré-visualização do PDF"
              src={previewUrl}
              style={{
                width: "100%",
                height: "100%",
                border: "1px solid #E2E8F0",
              }}
            />
          </AspectRatio>
        </Box>
      )}
    </VStack>
  );
}
