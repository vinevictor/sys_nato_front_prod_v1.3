import NatosignHome from "@/components/natosign";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "NATOSIGN",
};

export default function Natosign() {
  return (
    // <Flex justifyContent="center" alignItems="center" h="100%" w="100%">
    //   {/* <Image
    //     src="/Gemini_Generated_Image_338w3e338w3e338w.jpg"
    //     alt="Em desenvolvimento"
    //     width={500}
    //     height={500}
    //   /> */}
    // </Flex>
    <NatosignHome />
  );
}
