import { CardCreateUpdate } from "@/implementes/cardCreateUpdate";
import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  Input,
  VStack,
} from "@chakra-ui/react";
import { GetSessionServer } from "@/lib/auth_confg";
import { Metadata } from "next";
import { TagList } from "@/components/tag/tag-list"; // Importando o novo Client Component
import { revalidateTag } from "next/cache"; // Importando para revalidação

export const metadata: Metadata = {
  title: "Tags",
};

const getTags = async (session: SessionNext.Server) => {
  try {
    const url = `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`;
    const req = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session?.token}`,
      },
      cache: "force-cache",
      next: {
        tags: ["get_tags"],
      },
    });
    const res = await req.json();
    if (!req.ok) {
      throw new Error("Erro");
    }
    return res;
  } catch (error) {
    console.log(error);
    return [];
  }
};

type TagType = {
  id: number;
  label: string;
  createdAt: string;
};

export default async function Tags() {
  const session = (await GetSessionServer()) as SessionNext.Server;
  const tags = (await getTags(session)) as TagType[];

  const handleCreateTag = async (_: any, formData: FormData) => {
    "use server";
    const newTag = formData.get("tag");
    console.log("Nova tag:", newTag);
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/tag-list`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.token}`,
        },
        body: JSON.stringify({ label: newTag }),
      }
    );

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      revalidateTag("get_tags");
      return {
        message: "Tag criada com sucesso",
        status: 200,
      };
    } else {
      // Tratar erro
      console.error("Erro ao criar tag");
      return {
        message: "Erro ao criar tag",
        status: 500,
      };
    }
  };

  return (
    <>
      <Box
        w="100%"
        h="calc(100vh - 115px)"
        px={4} /* Ajuste h para considerar a navbar */
      >
        <Box
          w="100%"
          h="full"
          borderRadius="1.5rem" // Reduzindo um pouco o borderRadius
          boxShadow="xl" // Usando um boxShadow mais suave
          p={{ base: 4, md: 6, lg: 8 }} // Padding responsivo
          bg="white" // Adicionando um fundo branco para o card principal
        >
          <Heading
            as="h1"
            size="lg"
            mb={6}
            textAlign={{ base: "center", md: "left" }}
          >
            Gerenciamento de Tags
          </Heading>
          <Divider mb={6} borderColor="gray.300" />

          <Flex
            w="100%"
            h="calc(100% - 115px)" // Ajustar altura para caber o título e divider
            direction={{ base: "column", md: "row" }} // Coluna em mobile, linha em desktop
            gap={6} // Espaçamento entre as seções
          >
            {/* Seção Lista de Tags */}
            <Box
              w={{ base: "100%", md: "50%" }}
              p={4}
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
              h={{ base: "auto", md: "full" }}
            >
              <Heading fontSize="lg" mb={4} textAlign="center">
                Lista de Tags
              </Heading>
              <TagList tags={tags} />
            </Box>

            {/* Seção Cadastrar Tag */}
            <Box
              w={{ base: "100%", md: "50%" }}
              p={4}
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="flex-start" // Alinha ao topo
              borderWidth="1px"
              borderRadius="md"
              borderColor="gray.200"
            >
              <Heading fontSize="lg" mb={4} textAlign="center">
                Cadastrar Nova Tag
              </Heading>
              <Box w={{ base: "100%", sm: "80%", md: "70%", lg: "60%" }} mt={4}>
                <CardCreateUpdate.Form action={handleCreateTag}>
                  <VStack spacing={4}>
                    <Input
                      type="text"
                      name="tag"
                      placeholder="Nome da Tag"
                      size="lg"
                      focusBorderColor="blue.500"
                    />
                    <Button
                      w="full"
                      colorScheme="green"
                      type="submit"
                      size="lg"
                      _hover={{ bg: "green.600" }}
                    >
                      Cadastrar Tag
                    </Button>
                  </VStack>
                </CardCreateUpdate.Form>
              </Box>
            </Box>
          </Flex>
        </Box>
      </Box>
    </>
  );
}
