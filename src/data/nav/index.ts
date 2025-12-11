import { NavItem } from "@/types/navitem";
import { CgBriefcase, CgToday } from "react-icons/cg";
import { FaSignature } from "react-icons/fa";
import { FiFilePlus, FiGrid, FiHome } from "react-icons/fi";

export const defaultNavItems: NavItem[] = [
  {
    name: "Home",
    icon: FiHome,
    href: "/home",
    role: null,
  },
  {
    name: "Nova Solicitação",
    icon: FiFilePlus,
    href: "/solicitacoes",
    role: null,
  },
  {
    name: "NatoDireto",
    icon: CgBriefcase,
    href: "/direto",
    role: "DIRETO",
  },
  {
    name: "NatoFit",
    icon: CgBriefcase,
    href: "/",
    role: "FIT",
  },
  {
    name: "FAQ",
    icon: CgToday,
    href: "/faq",
    role: null,
  },
  {
    name: "NatoSign",
    icon: FaSignature,
    href: "/natosign",
    role: "natosign",
  },
  {
    name: "Nato Hub",
    href: "/hub",
    icon: FiGrid,
    role: "HUB",
  },
];
