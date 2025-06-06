import { FiUser } from "react-icons/fi";
import { MdDomain, MdOutlineHomeWork, MdOutlineTag } from "react-icons/md";
import { GoRepo } from "react-icons/go";

export const IconsPadrão = [
  {
    id: 1,
    label: 'Usuarios',
    path: '/usuarios',
    icon: <FiUser />
  },
  {
    id: 2,
    label: 'Empreendimentos',
    path: '/empreendimentos',
    icon: <MdDomain />
  },
  {
    id: 3,
    label: 'Construtora',
    path: '/construtoras',
    icon: <MdOutlineHomeWork />
  },
  {
    id: 4,
    label: 'CCAs',
    path: '/financeiras',
    icon: <GoRepo />
  },
  {
    id: 5,
    label: 'Tags',
    path: '/tags',
    icon: <MdOutlineTag />
  }
];
