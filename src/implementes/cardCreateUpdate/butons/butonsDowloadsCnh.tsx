"use client";
import { Flex, Link } from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { DataContext } from "../imputs/inputUpdateCnh";
import { DownloadDoc } from "@/components/DowloadDoc";


interface ButtonsDownloadsCnhProps {
  url?: string;
}

export function ButtonsDownloadsCnh({ url }: ButtonsDownloadsCnhProps) {
  const [UrlDownloads, setUrlDownloads] = useState<string>("");
  const [UrlBase64, setUrlBase64] = useState<string>("");

  // Use o `useContext` para acessar o valor do contexto
  const { Data } = useContext(DataContext);

  useEffect(() => {
    if (url) {
      const Verify = url.startsWith("data:");
      if (Verify) {
        setUrlBase64(url);
        return;
      } else {
        setUrlDownloads(url);
      }
    }
    if (Data) setUrlDownloads(Data);
  }, [url, Data]);

  return (
    <>
      <Flex gap={3} pt={1}>
        {UrlDownloads && (
          <>
            <Link
              href={UrlDownloads}
              target="_blank"
              rel="noopener noreferrer"
              bg={"green.500"}
              py={1}
              px={2}
              borderRadius={"8px"}
              color={"white"}
              fontSize={"sm"}
              textDecoration={"none"}
              fontWeight="bold"
              _hover={{
                bg: "green.500"
              }}
            >
              Download Do Arquivo
            </Link>
          </>
        )}
        {UrlBase64 && <DownloadDoc base64={UrlBase64} />}
      </Flex>
    </>
  );
}
