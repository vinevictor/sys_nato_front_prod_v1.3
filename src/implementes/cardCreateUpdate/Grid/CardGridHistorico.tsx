import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  BoxProps,
  Text,
} from "@chakra-ui/react";

interface CardGridUpdateCnhProps extends BoxProps {
  DataSolicitacao: solictacao.SolicitacaoGetType;
  user: any;
}

export default async function CardGridHistorico({
  DataSolicitacao,
  user,
  ...props
}: CardGridUpdateCnhProps) {
  const Hierarquia = user?.hierarquia;
  const log = DataSolicitacao.logDelete.split("\n");
  return (
    <>
      {Hierarquia === "ADM" && DataSolicitacao.logDelete && (
        <Box {...props}>
          <Accordion allowToggle>
            <AccordionItem>
              <h2>
                <AccordionButton border={"none"}>
                  <Box as="span" flex="1" textAlign="left">
                    Historico
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                {log.map((item, index) => (
                  <Text key={index}>{item}</Text>
                ))}
              </AccordionPanel>
            </AccordionItem>
          </Accordion>
        </Box>
      )}
    </>
  );
}
