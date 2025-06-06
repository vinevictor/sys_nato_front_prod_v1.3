"use client";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useFormStatus } from "react-dom";
import { BeatLoader } from "react-spinners";

type BtmProps = ButtonProps;

export function SaveBtm(props: BtmProps) {
  const { ...otherprops } = props;
  const status = useFormStatus();

  return (
    <>
      <Button
        {...otherprops}
        isLoading={status.pending ? true : false}
        spinner={<BeatLoader size={8} color="white" />}
      />
    </>
  );
}
