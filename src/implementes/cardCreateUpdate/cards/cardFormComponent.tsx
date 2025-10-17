"use client";
import { useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { PropsWithChildren, useEffect, useState } from "react";
import { useFormState } from "react-dom";

type HTMLFormProps = React.DetailedHTMLProps<
  React.FormHTMLAttributes<HTMLFormElement>,
  HTMLFormElement
>;

type CardFormProps = PropsWithChildren<
  Omit<HTMLFormProps, "action"> & {
    action: (prevState: any, formData: FormData) => Promise<any>;
    onSuccess?: () => void;
  }
>;

export function CardFormComponent(props: CardFormProps) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const toast = useToast();
  const route = useRouter();

  const [state, formAction] = useFormState(props.action, { error: null });

  useEffect(() => {
    if (state?.error) {
      setIsError(true);
    } else if (state?.error == null) {
    } else if (state?.id) {
      setIsSuccess(true);
    } else {
      setIsSuccess(true);
    }
  }, [state]);

  useEffect(() => {
    if (isSuccess) {
      toast({
        title: "Sucesso",
        description: "Informações salvas com sucesso",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
      
      // Chama callback de sucesso se fornecida
      if (props.onSuccess) {
        props.onSuccess();
      }
      
      // Recarrega a página após um pequeno delay
      setTimeout(() => {
        window.location.reload();
      }, 500);
      
      setIsSuccess(false); // Reset state after showing toast
    }
    if (isError) {
      toast({
        title: "Erro ao salvar as informações",
        description:
          state?.message ||
          "Erro inesperado, favor verificar os dados, e tente novamente",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setIsError(false); // Reset state after showing toast
    }
  }, [isSuccess, isError, toast, route, state?.message]);

  return <form {...props} action={formAction} />;
}
