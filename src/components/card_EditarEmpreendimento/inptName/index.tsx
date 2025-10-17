import { Input, InputProps } from "@chakra-ui/react";

type EmpreendimentoNameProps = InputProps

export default function InputNameEmpreendimento({ ...props }: EmpreendimentoNameProps) {
    return (
        <Input {...props} />
    )
}
    
