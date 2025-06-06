import { Box, BoxProps, FormLabel } from "@chakra-ui/react";
import InputValor from "../imputs/imputValor";

interface CardGridValorcertProps extends BoxProps {
    valor_cert: string;
}

export default function CardGridValorcert({ valor_cert, ...props }: CardGridValorcertProps) {
    return (
        <>
            <Box {...props}>
                <FormLabel fontSize="sm" fontWeight="md" m={0}>
                    Valor do Certificado
                </FormLabel>
                <InputValor
                    name="valor_cert"
                    variant="flushed"
                    setValueValor={valor_cert}
                    borderColor={"gray.400"}
                    px={1}
                    bg={"gray.100"}
                    // isReadOnly
                />
            </Box>
        </>
    )
}