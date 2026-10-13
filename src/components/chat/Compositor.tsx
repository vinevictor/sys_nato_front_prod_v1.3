"use client";

import {
  Box,
  Flex,
  HStack,
  Icon,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { useEffect, useRef, useState } from "react";
import {
  FiCamera,
  FiFileText,
  FiImage,
  FiMic,
  FiPaperclip,
  FiSend,
  FiTrash2,
} from "react-icons/fi";

const MAX_BYTES = 16 * 1024 * 1024;

const piscar = keyframes`50% { opacity: 0.2; }`;

// Chrome/Firefox gravam webm/ogg, Safari só mp4
const MIMES_AUDIO = [
  "audio/webm;codecs=opus",
  "audio/webm",
  "audio/mp4",
  "audio/ogg;codecs=opus",
];

interface CompositorProps {
  onEnviarTexto: (texto: string) => Promise<void>;
  onEnviarArquivo: (
    file: File,
    extras?: { duracaoSeg?: number }
  ) => Promise<void>;
  onDigitar?: () => void;
  onPararDigitar?: () => void;
  desabilitado?: boolean;
  avisoDesabilitado?: string;
}

export default function Compositor({
  onEnviarTexto,
  onEnviarArquivo,
  onDigitar,
  onPararDigitar,
  desabilitado,
  avisoDesabilitado,
}: CompositorProps) {
  const toast = useToast();
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);
  const inputCamera = useRef<HTMLInputElement>(null);
  const inputImagem = useRef<HTMLInputElement>(null);
  const inputPdf = useRef<HTMLInputElement>(null);
  const gravador = useGravadorAudio();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const ajustarAltura = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 140)}px`;
  };
  useEffect(ajustarAltura, [texto]);
  const bg = useColorModeValue("#F0F2F5", "gray.800");
  const bgInput = useColorModeValue("white", "gray.700");

  const erro = (title: string) =>
    toast({ title, status: "error", position: "top", duration: 4000 });

  const enviarTexto = async () => {
    const t = texto.trim();
    if (!t || enviando) return;
    setEnviando(true);
    onPararDigitar?.();
    try {
      await onEnviarTexto(t);
      setTexto("");
    } catch (e: any) {
      erro(e?.message || "Não foi possível enviar");
    } finally {
      setEnviando(false);
    }
  };

  const enviarArquivo = async (file: File, duracaoSeg?: number) => {
    if (file.size > MAX_BYTES) return erro("Arquivo maior que 16MB");
    setEnviando(true);
    try {
      await onEnviarArquivo(file, { duracaoSeg });
    } catch (e: any) {
      erro(e?.message || "Não foi possível enviar o arquivo");
    } finally {
      setEnviando(false);
    }
  };

  const aoEscolher = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (file) enviarArquivo(file);
  };

  const pararEEnviarAudio = async () => {
    const resultado = await gravador.parar();
    if (resultado) enviarArquivo(resultado.file, resultado.duracaoSeg);
  };

  const iniciarAudio = async () => {
    const ok = await gravador.iniciar();
    if (!ok) erro("Permita o uso do microfone para gravar áudio");
  };

  if (desabilitado) {
    return (
      <Box bg={bg} px={4} py={3} textAlign="center">
        <Text fontSize="sm" color="gray.500">
          {avisoDesabilitado || "Envio indisponível"}
        </Text>
      </Box>
    );
  }

  return (
    <Box
      bg={bg}
      px={2}
      py={2}
      // respeita a barra inferior do iPhone
      pb="calc(0.5rem + env(safe-area-inset-bottom))"
    >
      <input
        ref={inputCamera}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={aoEscolher}
      />
      <input
        ref={inputImagem}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        hidden
        onChange={aoEscolher}
      />
      <input
        ref={inputPdf}
        type="file"
        accept="application/pdf"
        hidden
        onChange={aoEscolher}
      />

      {gravador.gravando ? (
        <HStack spacing={2}>
          <IconButton
            aria-label="Cancelar gravação"
            icon={<FiTrash2 />}
            variant="ghost"
            colorScheme="red"
            borderRadius="full"
            onClick={gravador.cancelar}
          />
          <Flex
            flex={1}
            align="center"
            gap={2}
            bg={bgInput}
            borderRadius="full"
            px={4}
            h="44px"
          >
            <Box
              w={2.5}
              h={2.5}
              borderRadius="full"
              bg="red.500"
              animation={`${piscar} 1s infinite`}
            />
            <Text fontSize="sm" sx={{ fontVariantNumeric: "tabular-nums" }}>
              {formatarDuracao(gravador.segundos)}
            </Text>
            <Text fontSize="sm" color="gray.500">
              Gravando…
            </Text>
          </Flex>
          <IconButton
            aria-label="Enviar áudio"
            icon={<FiSend />}
            colorScheme="green"
            borderRadius="full"
            size="lg"
            onClick={pararEEnviarAudio}
          />
        </HStack>
      ) : (
        <HStack spacing={1} align="flex-end">
          <Menu placement="top-start">
            <MenuButton
              as={IconButton}
              aria-label="Anexar"
              icon={<FiPaperclip />}
              variant="ghost"
              borderRadius="full"
              size="lg"
              isDisabled={enviando}
            />
            <MenuList>
              <MenuItem
                icon={<Icon as={FiCamera} />}
                onClick={() => inputCamera.current?.click()}
              >
                Tirar foto
              </MenuItem>
              <MenuItem
                icon={<Icon as={FiImage} />}
                onClick={() => inputImagem.current?.click()}
              >
                Imagem da galeria
              </MenuItem>
              <MenuItem
                icon={<Icon as={FiFileText} />}
                onClick={() => inputPdf.current?.click()}
              >
                Documento PDF
              </MenuItem>
            </MenuList>
          </Menu>

          <Textarea
            value={texto}
            ref={textareaRef}
            onChange={(e) => {
              setTexto(e.target.value);
              ajustarAltura();
              if (e.target.value) onDigitar?.();
            }}
            onKeyDown={(e) => {
              // Enter envia no desktop; no celular o Enter quebra linha
              if (
                e.key === "Enter" &&
                !e.shiftKey &&
                window.matchMedia("(pointer: fine)").matches
              ) {
                e.preventDefault();
                enviarTexto();
              }
            }}
            placeholder="Mensagem"
            bg={bgInput}
            borderRadius="22px"
            resize="none"
            rows={1}
            minH="44px"
            maxH="140px"
            py={2.5}
            px={4}
            fontSize="md" // 16px evita o zoom automático no iPhone
            border="none"
            focusBorderColor="transparent"
            maxLength={4000}
          />

          {texto.trim() ? (
            <IconButton
              aria-label="Enviar"
              icon={<FiSend />}
              colorScheme="green"
              borderRadius="full"
              size="lg"
              onClick={enviarTexto}
              isLoading={enviando}
            />
          ) : (
            <IconButton
              aria-label="Gravar áudio"
              icon={<FiMic />}
              colorScheme="green"
              borderRadius="full"
              size="lg"
              onClick={iniciarAudio}
              isLoading={enviando}
              isDisabled={!gravador.suportado}
            />
          )}
        </HStack>
      )}
    </Box>
  );
}

function formatarDuracao(s: number) {
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

function useGravadorAudio() {
  const [gravando, setGravando] = useState(false);
  const [segundos, setSegundos] = useState(0);
  const [suportado, setSuportado] = useState(true);
  const recorder = useRef<MediaRecorder | null>(null);
  const partes = useRef<Blob[]>([]);
  const inicio = useRef(0);
  const intervalo = useRef<ReturnType<typeof setInterval>>(undefined);

  useEffect(() => {
    setSuportado(
      typeof window !== "undefined" &&
        !!navigator.mediaDevices?.getUserMedia &&
        typeof MediaRecorder !== "undefined"
    );
    return () => liberar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const liberar = () => {
    clearInterval(intervalo.current);
    recorder.current?.stream.getTracks().forEach((t) => t.stop());
    recorder.current = null;
    setGravando(false);
    setSegundos(0);
  };

  const iniciar = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = MIMES_AUDIO.find((m) => MediaRecorder.isTypeSupported(m));
      const rec = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      partes.current = [];
      rec.ondataavailable = (e) => e.data.size && partes.current.push(e.data);
      rec.start();
      recorder.current = rec;
      inicio.current = Date.now();
      setGravando(true);
      intervalo.current = setInterval(
        () => setSegundos(Math.floor((Date.now() - inicio.current) / 1000)),
        500
      );
      return true;
    } catch {
      liberar();
      return false;
    }
  };

  const parar = () =>
    new Promise<{ file: File; duracaoSeg: number } | null>((resolve) => {
      const rec = recorder.current;
      if (!rec) return resolve(null);
      const duracaoSeg = Math.round((Date.now() - inicio.current) / 1000);
      rec.onstop = () => {
        const tipo = (rec.mimeType || "audio/webm").split(";")[0];
        const blob = new Blob(partes.current, { type: tipo });
        liberar();
        if (duracaoSeg < 1 || !blob.size) return resolve(null);
        const ext = tipo.includes("mp4") ? "m4a" : tipo.split("/")[1];
        resolve({
          file: new File([blob], `audio.${ext}`, { type: tipo }),
          duracaoSeg,
        });
      };
      rec.stop();
    });

  const cancelar = () => {
    if (recorder.current) {
      recorder.current.onstop = null;
      recorder.current.stop();
    }
    liberar();
  };

  return { gravando, segundos, suportado, iniciar, parar, cancelar };
}
