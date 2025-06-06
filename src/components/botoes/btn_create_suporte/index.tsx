/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { createSuportAlert } from "@/actions/solicitacoes/service/createUpdateService";
import DeleteImgSuporte from "@/actions/solicitacoes/service/deleteImgSuporte";
import DeleteSuporte from "@/actions/solicitacoes/service/deleteSuporte";
import { GetAllSuporteId } from "@/actions/solicitacoes/service/getAllSuporteId";
import { GetSuporteById } from "@/actions/solicitacoes/service/getSuporteId";
import UpdateService from "@/actions/solicitacoes/service/updateService";
import { SuporteTagsOptions } from "@/data/suporte";
import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Textarea,
  Text,
  useDisclosure,
  useToast,
  Icon,
  Box,
  Input,
  Tooltip,
  Image,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";

interface CreateSuportAlertProps {
  id: number;
}

export default function CreateSuportAlert({ id }: CreateSuportAlertProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [descricao, setDescricao] = useState<string>("");
  const [TagUni, setTagUni] = useState<number>(0);
  const [update, setUpdate] = useState<boolean>(false);
  const [IdUpdate, setIdUpdate] = useState<number>(0);
  const [TagsId, setTagsId] = useState<number>(0);
  const [suporteTags, setSuporteTags] = useState<any>([]);
  const toast = useToast();

  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [storedImages, setStoredImages] = useState<any[]>([]);
  const [urlFinal, setUrlFinal] = useState<{ urlDownload: string, urlView: string }[]>([]);
  const [imgSuspensa, setImgSuspensa] = useState<string>('');

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const droppedFiles = event.dataTransfer.files;
    handleFiles(droppedFiles);
  };

  const handleFiles = async (uploadedFiles: FileList) => {
    const filesArray = Array.from(uploadedFiles);
    
    for (const file of filesArray) {
      if (
          file.type === "application/pdf" ||
          file.type === "image/jpeg" ||
          file.type === "image/webp" ||
          file.type === "image/png"
      ) {
          const formData = new FormData();
          formData.append("file", file);
          
          try {
              const response = await axios.post(`/api/suporte/post`, formData, {
                  headers: {
                      "Content-Type": "multipart/form-data",
                  },
              });
              if (response.status === 200) {
                  const url = response.data.data.url;
                  const ulrView = response.data.data.viewUrl;
                  const urlFileName = response.data.data.filename;
                  const urlObj = { urlDownload: url, urlView: ulrView, urlFileName: urlFileName };
                  
                  setUrlFinal((prev) => [...prev, urlObj]);

                  toast({
                      title: "Arquivo salvo",
                      status: "success",
                      duration: 3000,
                      isClosable: true,
                  });
              }
          } catch (error) {
              console.error(error);
              toast({
                  title: "Erro ao salvar arquivo",
                  status: "error",
                  duration: 3000,
                  isClosable: true,
              });
          }
      }
    }

    const newImagePreviews = filesArray
        .filter((file) => file.type.startsWith('image/'))
        .map((file) => URL.createObjectURL(file));

    setFiles((prevFiles) => [...prevFiles, ...filesArray]);
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newImagePreviews]);
  };

  const handleClick = () => {
    document.getElementById('file-input')?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = event.target.files;
    if (uploadedFiles) {
        handleFiles(uploadedFiles);
    }
  };

  const handleRemove = (index: number, event: React.MouseEvent) => {
    event.stopPropagation();
    const newFiles = files.filter((_, i) => i !== index);
    const newImagePreviews = imagePreviews.filter((_, i) => i !== index);
    setFiles(newFiles);
    setImagePreviews(newImagePreviews);
  };

  const handleDeleteImage = async (tagId: number, index: number, fileName: string ,event: React.MouseEvent) => {
    event.stopPropagation();
    const delImage = await axios(`/api/suporte/delete`,   {
      method: 'DELETE',
      data: {
        image : fileName 
      },
    });
    if (delImage.status === 200) {
      const newUrlFinal = urlFinal.filter((_, i) => i !== index);
      setUrlFinal(newUrlFinal);
      toast({
        title: "Sucesso",
        description: "Imagem deletada com sucesso",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Erro",
        description: "Erro ao deletar imagem",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
    const req = await DeleteImgSuporte(tagId, index);
    if (req.error) {
      toast({
        title: "Erro",
        description: req.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const newStoredImages = storedImages.filter((_, i) => i !== index);
      setStoredImages(newStoredImages);
      toast({
        title: "Sucesso",
        description: req.message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
    }
  }

  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = '';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const HandleOnClick = async (idTag: number) => {
    setUpdate(true);
    const req = await GetSuporteById(idTag);
    if(req.error){
      toast({
        title: "Erro",
        description: req.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }

    const res = req.data
    
    console.log("🚀 ~ HandleOnClick ~ res:", res)
    if (res) {
      const selectedTag = SuporteTagsOptions.find(
        (item) => item.label === res.tag
      );
      if (selectedTag) {
        setTagUni(selectedTag.id);
        setTagsId(selectedTag.id);
      }
      setDescricao(res?.deescricao || "");
      if(res.imgSuspensa){
        setImgSuspensa(res.imgSuspensa)
        
      }else{
        setStoredImages(res.urlSuporte.map((url: any) => {
          return {
            urlDownload: url.urlDownload,
            urlView: url.urlView,
            urlFileName: url.urlFileName
          }
        }));
      }
      setIdUpdate(idTag);
      onOpen();
    }
  };

  const HandleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const req = await UpdateService(IdUpdate, TagsId, descricao, urlFinal);
    if (req?.error) {
      toast({
        title: "Erro",
        description: req?.message || "Erro desconhecido",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Sucesso",
        description: req?.message || "Sucesso desconhecido",
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchTags();
      
    }
    setStoredImages([]);
    setDescricao("");
    setUrlFinal([]);
    setFiles([]);
    setImagePreviews([]);
    setUpdate(false);
    onClose();
  };

  const Handle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const req = await createSuportAlert(id, descricao, TagsId, urlFinal);
    if (req.error) {
      toast({
        title: "Erro",
        description: req.message,
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      toast({
        title: "Sucesso",
        description: req.message,
        status: "success",
        duration: 9000,
        isClosable: true,
      });
      fetchTags();
    }
    setStoredImages([]);
    setDescricao("");
    setUrlFinal([]);
    setFiles([]);
    setImagePreviews([]);
    onClose();
  };

  useEffect(() => {
    fetchTags();
  }, [id, update]);

  async function fetchTags() {
    const req = await GetAllSuporteId(id);
    if(req.error){
      setSuporteTags([req.message]);
    }else{
      setSuporteTags(req.data);
    }
  }

  const handleModalClose = () => {
    setUpdate(false);
    setDescricao("");
    setTagUni(0);
    setImagePreviews([]);
    setStoredImages([]);
    setUrlFinal([]);
    onClose();
  };

  const RendBoard = suporteTags.map((item: any) => {
    const DeleteTag = async () => {
      const request = await DeleteSuporte(item.id);
      if (!request.error) {
        toast({
          title: "Sucesso!",
          description: "Suporte deletado com sucesso.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
        fetchTags();
      } else {
        toast({
          title: "Erro!",
          description: "Erro ao deletar suporte.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    };

    return (
      <Flex key={item.id}>
        <Flex
          gap={1}
          border="1px solid #b8b8b8cc"
          p={1}
          alignItems={"center"}
          borderRadius={9}
          bg={"blue.200"}
          cursor={"pointer"}
          _hover={{ bg: "blue.300" }}
        >
          <Text
            fontSize={"0.8rem"}  
            onClick={() => HandleOnClick(item.id)}
          >
            {item.tag}
          </Text>
          <Icon
            as={RxCross2}
            fontSize={"0.8rem"}
            onClick={DeleteTag}
            cursor={"pointer"}
            borderRadius={3}
            _hover={{ bg: "red.500" }}
          />
        </Flex>
      </Flex>
    );
  });

  return (
    <>
      <Button
        py={1}
        px={5}
        border="none"
        borderRadius="4px"
        bg={"green.500"}
        color={"white"}
        _hover={{ bg: "green.600", textDecoration: "none" }}
        cursor={"pointer"}
        fontSize={"1rem"}
        onClick={() => {
          onOpen();
          setUpdate(false);
          setDescricao("");
          setTagUni(0);
        }}
      >
        Suporte
      </Button>
      <Flex flexDir={"column"} gap={1} mt={1}>
        {RendBoard}
      </Flex>

      <Modal isOpen={isOpen} size={"xl"} onClose={handleModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {update ? "Editar Suporte" : "Anexar Suporte"}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDir={"column"} gap={5}>
              <FormControl>
                <FormLabel>Tag</FormLabel>
                <Select
                  onChange={(e) => {
                    const selectedId = Number(e.target.value);
                    setTagUni(selectedId);
                    setTagsId(selectedId);
                  }}
                  value={TagUni}
                  placeholder="Selecione uma Tag"
                >
                  {SuporteTagsOptions.map((i: any) => (
                    <option key={i.id} value={i.id}>
                      {i.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <Textarea
                  w={"100%"}
                  h={"10rem"}
                  resize={"none"}
                  ps={3}
                  bg={"gray.100"}
                  boxShadow="lg"
                  onChange={(e) => setDescricao(e.target.value)}
                  value={descricao}
                />
              </FormControl>
              
              <Text fontSize={"1rem"}>Anexar Arquivo</Text>
              <Box textAlign="center">
                <Box
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleClick}
                  border="2px dashed"
                  borderColor="gray.300"
                  borderRadius="md"
                  p={5}
                  cursor="pointer"
                  _hover={{ borderColor: 'gray.500' }}
                >
                  <Input
                    id="file-input"
                    type="file"
                    multiple
                    onChange={handleChange}
                    display="none"
                  />
                  <Text fontSize={useBreakpointValue({ base: 'lg', md: 'xl' })}>
                    Arraste arquivos aqui ou clique para selecionar
                  </Text>
                </Box>
                
                <Box display="flex" flexWrap="wrap" justifyContent="center" mt={4}>
                  {imagePreviews.map((preview, index) => (
                    <Box key={index} position="relative" mr={2} mb={2}>
                      <Tooltip label="Excluir" placement="top" hasArrow>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={(event) => handleRemove(index, event)}
                          position="absolute"
                          top={1}
                          right={1}
                          zIndex={1}
                        >
                          x
                        </Button>
                      </Tooltip>
                      <Image
                        src={preview}
                        alt={`Preview ${index}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                        transition="transform 0.2s"
                        _hover={{ transform: 'scale(1.2)' }}
                        onClick={() => handleDownload(preview)}
                      />
                    </Box>
                  ))}
                </Box>

                  {imgSuspensa && update ? <Text color={'red'}>Suspenso: {imgSuspensa}</Text> : 
                <Box display="flex" flexWrap="wrap" justifyContent="center" mt={4}>
                  {update ? storedImages.map((image, index) => (
                    <Box key={index} position="relative" mr={2} mb={2}>
                        <Tooltip label="Excluir" placement="top" hasArrow>
                        <Button
                          size="xs"
                          colorScheme="red"
                          onClick={(event) => handleDeleteImage(IdUpdate, index, image.urlFileName, event)}
                          position="absolute"
                          top={1}
                          right={1}
                          zIndex={1}
                        >
                          x
                        </Button>
                      </Tooltip>
                      <Image
                        src={image.urlView}
                        alt={`Stored Preview ${index}`}
                        boxSize="100px"
                        objectFit="cover"
                        borderRadius="md"
                        transition="transform 0.2s"
                        _hover={{ transform: 'scale(1.2)' }}
                        onClick={() => handleDownload(image.urlDownload)} 
                      />
                      
                    </Box>
                  )) : null} 
                </Box>}
              </Box>
            </Flex>
          </ModalBody>

          <ModalFooter gap={3}>
            {update ? (
              <Button colorScheme="green" onClick={HandleUpdate}>
                Confirmar
              </Button>
            ) : (
              <Button colorScheme="green" onClick={Handle}>
                Confirmar
              </Button>
            )}
            <Button
              colorScheme="red"
              onClick={handleModalClose}
            >
              Cancelar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
