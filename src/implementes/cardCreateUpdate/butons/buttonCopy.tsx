'use client';
import { IconButton } from "@chakra-ui/react";
import { FaCopy } from "react-icons/fa6";


interface ButtonCopyProps {
    onCopyText: string
}

export function ButtonCopy({ onCopyText }: ButtonCopyProps) {
  return (
    <IconButton
      icon={<FaCopy />}
      size="sm"
      aria-label="Copy icon"
      onClick={() => navigator.clipboard.writeText(onCopyText)}
    />
  );
}