import { Box } from "@chakra-ui/react";
import { keyframes } from "@emotion/react";
import { memo, useMemo } from "react";

interface NowIconComponentProps {
  now?: boolean;
}

const rgbBlink = keyframes`
  0% { color: green; }
  10% { color: yellowgreen; }
  20% { color: orange; }
  30% { color: red; }
  40% { color: blue; }
  50% { color: white; }
  60% { color: green; }
  70% { color: yellowgreen; }
  80% { color: orange; }
  90% { color: red; }
  100% { color: blue; }
`;

export const NowIconComponent = memo(({ now }: NowIconComponentProps) => {
  const boxStyles = useMemo(() => ({
    active: {
      transform: "rotate(-35deg)",
      textOrientation: "upright",
      animation: `${rgbBlink} 1s infinite`,
    },
    inactive: {
      transform: "rotate(-35deg)",
      textOrientation: "upright",
      color: "gray.300",
      cursor: "not-allowed",
    }
  }), []);
  return (
    <>
      {now ? (
        <Box
          alignSelf={"center"}
          as="span"
          fontWeight="bold"
          sx={boxStyles.active}
        >
          N O W
        </Box>
      ) : (
        <Box
          alignSelf={"center"}
          as="span"
          fontWeight="bold"
          sx={boxStyles.inactive}
        >
          N O W
        </Box>
      )}
    </>
  );
});

NowIconComponent.displayName = "NowIconComponent";