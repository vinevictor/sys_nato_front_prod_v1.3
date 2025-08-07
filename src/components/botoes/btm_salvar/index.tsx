import { Button } from "@chakra-ui/react";
import { useState } from "react";
import { BeatLoader } from "react-spinners";




export default function BtmSalvar() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSalvar = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 6000));
    setIsLoading(false);
  };

    return (
        <Button
            type="submit"
            mt={2}
            alignSelf={"center"}
            colorScheme="green"
            size="lg"
        w={{ base: "100%", md: "auto" }}
        isLoading={isLoading}
        spinner={<BeatLoader size={8} color='white' />}
        onClick={handleSalvar}
        >
            Salvar
        </Button>
    );
}