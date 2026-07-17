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
  Link,
  Flex,
} from "@chakra-ui/react";
import { FiUpload, FiCheckCircle, FiExternalLink } from "react-icons/fi";

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
        <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
          <Text
            color="green.600"
            display="flex"
            alignItems="center"
            fontSize="sm"
          >
            <Icon as={FiCheckCircle} mr={2} />
            Arquivo selecionado: <strong>{formData.document.name}</strong>
          </Text>

          {previewUrl && (
            <Link
              href={previewUrl}
              isExternal
              color="blue.500"
              fontSize="sm"
              fontWeight="semibold"
              display="flex"
              alignItems="center"
              gap={1}
            >
              Abrir em tela cheia <Icon as={FiExternalLink} />
            </Link>
          )}
        </Flex>
      )}

      {previewUrl && (
        <Box>
          <FormLabel>Visualização do Documento</FormLabel>
          <AspectRatio ratio={4 / 5} maxH="600px">
            {/* Trocado iframe por object/embed que possui melhor suporte a blobs PDF em HTTPS */}
            <object
              data={previewUrl}
              type="application/pdf"
              width="100%"
              height="100%"
              style={{ border: "1px solid #E2E8F0", borderRadius: "6px" }}
            >
              <embed src={previewUrl} type="application/pdf" />
              <Box p={4} textAlign="center" bg="gray.50" borderRadius="md">
                <Text mb={2}>
                  O visualizador do navegador não conseguiu carregar o PDF.
                </Text>
                <Button
                  as="a"
                  href={previewUrl}
                  target="_blank"
                  colorScheme="blue"
                  size="sm"
                  leftIcon={<Icon as={FiExternalLink} />}
                >
                  Visualizar PDF Alternativo
                </Button>
              </Box>
            </object>
          </AspectRatio>
        </Box>
      )}
    </VStack>
  );
}
