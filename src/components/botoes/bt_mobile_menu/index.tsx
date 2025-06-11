"use client";
import { MenuItem } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import { ReactElement } from "react";

type BotaoMobileMenuProps = {
  name: string;
  path: string;
  icon: ReactElement;
};
export default function BotaoMobileMenu({
  name,
  path,
  icon,
}: BotaoMobileMenuProps) {
  const router = useRouter();

  return (
    <>
      <MenuItem
        icon={icon}
        onClick={() => {
          if (name !== "Sair") {
            (async () => {
              await fetch("/api/auth/logout");
            })();
            router.push("/login");
          }
          router.push(path);
        }}
      >
        {name.toUpperCase()}
      </MenuItem>
    </>
  );
}
