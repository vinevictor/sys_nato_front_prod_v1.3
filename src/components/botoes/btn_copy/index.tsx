"use client";
import { IconButton, IconButtonProps, useToast } from "@chakra-ui/react";

interface BtmCopyProps extends IconButtonProps {
  value: string;
  label: string;
}

export function BtmCopy({ label, value, ...props }: BtmCopyProps) {
  const toast = useToast();
  return (
    <>
      <IconButton
        {...props}
        onClick={() => {
          navigator.clipboard.writeText(value || "");
          toast({
            title: `${label} copiado!`,
            status: "info",
            duration: 2000,
            position: "top-right"
          });
        }}
      />
    </>
  );
}
