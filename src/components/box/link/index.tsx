import { FormControl, FormLabel, Link, Text, BoxProps } from "@chakra-ui/react";

interface BoxBasicProps extends BoxProps {
  id: string;
  label: string;
  value: string | number | null;
  href?: string;
  isLink?: boolean;
  required?: boolean;
}

export default function BoxBasic({
  id,
  label,
  value,
  href,
  isLink = false,
  required = false,
  ...props
}: BoxBasicProps) {
  return (
    <FormControl id={id} {...props}>
      <FormLabel
        htmlFor={id}
        fontSize="sm"
        display="flex"
        alignItems="center"
        w="full"
        gap={1}
        m={0}
      >
        {label}
        {required && (
          <Text as="span" fontSize="xs" color="red">
            Obrigatório*
          </Text>
        )}
      </FormLabel>

      {isLink && href ? (
        <Link
          href={href}
          target="_blank"
          fontWeight="bold"
          color="teal.600"
          ps={1}
        >
          {value}
        </Link>
      ) : (
        <Text ps={1}>{value}</Text>
      )}
    </FormControl>
  );
}
