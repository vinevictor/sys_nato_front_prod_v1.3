"use client";

import { Box, Button, Link, Text, useToast } from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";

interface VideoProps {
    url: string;
}

/**
 * Componente para exibição de vídeos
 * 
 * Gerencia a reprodução de vídeos, incluindo tratamento de erros e eventos de carregamento
 * com suporte a diferentes formatos e fallback para download direto quando não for possível reproduzir
 */
export default function VideoComponent({ url }: VideoProps) {
    const toast = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showFallback, setShowFallback] = useState(false);
    const [directUrl, setDirectUrl] = useState<string>(url);

    useEffect(() => {
        // Resetar estados quando a URL mudar
        setError(null);
        setIsLoading(true);
        setShowFallback(false);
        setDirectUrl(url);

        // Verificar se o vídeo está vindo do proxy. Se não, tentar criar URL de proxy
        if (!url.includes('/api/video-proxy') && !url.includes('blob:')) {
            setDirectUrl(`/api/video-proxy?url=${encodeURIComponent(url)}`);
        }

        // Limpar qualquer lógica anterior ao desmontar o componente
        return () => {
            // Cancelar qualquer requisição pendente ou limpar timers, se necessário
        };
    }, [url]);

    const handleError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
        console.error("Erro ao reproduzir o vídeo:", e);
        const videoElement = e.currentTarget;
        const errorMessage = videoElement.error?.message || "Erro desconhecido ao carregar o vídeo";
        
        setError(errorMessage);
        setIsLoading(false);
        setShowFallback(true);
        
        // Verificar se é o erro específico de streams não suportados
        if (errorMessage.includes("DEMUXER_ERROR_NO_SUPPORTED_STREAMS")) {
            toast({
                title: "Formato de vídeo não suportado",
                description: "Seu navegador não suporta este formato de vídeo. Tente baixar o vídeo e reproduzi-lo em um player externo.",
                status: "warning",
                duration: 8000,
                isClosable: true,
            });
        } else {
            toast({
                title: "Erro ao reproduzir o vídeo",
                description: "Não foi possível carregar o vídeo. Tente novamente mais tarde.",
                status: "error",
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleLoadedData = () => {
        setIsLoading(false);
        setShowFallback(false);
        console.log("Vídeo carregado com sucesso!");
    };

    const retryWithProxy = () => {
        if (!url.includes('/api/video-proxy')) {
            const proxyUrl = `/api/video-proxy?url=${encodeURIComponent(url)}`;
            setDirectUrl(proxyUrl);
            setError(null);
            setIsLoading(true);
            setShowFallback(false);
        }
    };

    // Extrai o nome do arquivo da URL para exibição
    const getFilenameFromUrl = (url: string): string => {
        try {
            const pathname = new URL(url).pathname;
            const filename = pathname.split('/').pop() || 'video';
            return filename;
        } catch (e) {
            // Se não for uma URL válida, retorna um nome genérico
            return 'video.mp4';
        }
    };

    return (
        <Box position="relative" width="100%" ref={containerRef}>
            {isLoading && (
                <Box 
                    position="absolute"
                    top="50%"
                    left="50%"
                    transform="translate(-50%, -50%)"
                    zIndex="2"
                >
                    {/* Indicador de carregamento */}
                    <Box 
                        width="50px" 
                        height="50px" 
                        borderRadius="50%"
                        border="3px solid gray"
                        borderTopColor="white"
                        animation="spin 1s linear infinite"
                        sx={{
                            '@keyframes spin': {
                                '0%': { transform: 'rotate(0deg)' },
                                '100%': { transform: 'rotate(360deg)' },
                            },
                        }}
                    />
                </Box>
            )}

            {/* Player de vídeo */}
            {!showFallback && (
                <video
                    ref={videoRef}
                    src={directUrl}
                    style={{ width: "100%", display: error ? "none" : "block" }}
                    controls
                    autoPlay
                    preload="metadata"
                    onError={handleError}
                    onLoadedData={handleLoadedData}
                    playsInline
                />
            )}

            {/* Área de fallback para quando o vídeo não puder ser reproduzido */}
            {showFallback && (
                <Box 
                    p={6} 
                    bg="gray.100" 
                    color="gray.800" 
                    textAlign="center"
                    borderRadius="md"
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    gap={4}
                >
                    <Text fontSize="lg" fontWeight="bold">
                        Não foi possível reproduzir o vídeo
                    </Text>
                    
                    <Text>
                        O formato deste vídeo não é suportado pelo seu navegador.
                    </Text>
                    
                    <Box mt={2} display="flex" gap={4} flexWrap="wrap" justifyContent="center">
                        <Button 
                            colorScheme="blue" 
                            onClick={retryWithProxy}
                            size="sm">
                            Tentar novamente via proxy
                        </Button>
                        
                        <Link 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            _hover={{ textDecoration: 'none' }}
                        >
                            <Button colorScheme="green" size="sm">
                                Baixar vídeo
                            </Button>
                        </Link>
                        
                        <Link 
                            href={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}`} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            _hover={{ textDecoration: 'none' }}
                        >
                            <Button colorScheme="teal" size="sm">
                                Abrir no Google
                            </Button>
                        </Link>
                    </Box>
                </Box>
            )}

            {/* Mensagem de erro (apenas se não estiver em modo fallback) */}
            {error && !showFallback && (
                <Box 
                    p={4} 
                    bg="red.100" 
                    color="red.800" 
                    textAlign="center"
                    borderRadius="md"
                >
                    Erro ao carregar o vídeo: {error}
                </Box>
            )}
        </Box>
    );
}