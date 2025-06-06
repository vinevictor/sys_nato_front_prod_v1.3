"use client";
import { Button } from "@chakra-ui/react";

interface DownloadDocProps {
  base64: string;
}

export const DownloadDoc = ({ base64 }: DownloadDocProps) => {
  const handleDownload = () => {
    if (base64) {
      // Remove o prefixo 'data:...;base64,' caso esteja presente
      const cleanBase64 = base64.includes(",") ? base64.split(",")[1] : base64;

      // Detecta o tipo MIME com base nos primeiros caracteres do Base64
      let mimeType = "";
      if (base64.startsWith("data:application/pdf")) {
        mimeType = "application/pdf";
      } else if (base64.startsWith("data:image/png")) {
        mimeType = "image/png";
      } else if (base64.startsWith("data:image/jpeg")) {
        mimeType = "image/jpeg";
      }

      try {
        const byteCharacters = atob(cleanBase64); // Decodifica o Base64
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);

        // Cria o Blob com o MIME type identificado
        const blob = new Blob([byteArray], { type: mimeType });

        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.href = url;

        // Define o nome do arquivo com base no tipo MIME
        const fileName = mimeType.includes("pdf")
          ? "documento.pdf"
          : mimeType.includes("image/png")
          ? "imagem.png"
          : mimeType.includes("image/jpeg")
          ? "imagem.jpg"
          : "arquivo";

        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Libera o objeto URL para evitar vazamento de memória
        URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Erro ao decodificar Base64:", error);
      }
    }
  };

  return (
    <>
      {base64 && (
        <Button size="sm" colorScheme="green" onClick={handleDownload}>
          Download Base64
        </Button>
      )}
    </>
  );
};
