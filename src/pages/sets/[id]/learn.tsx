import {
  Box,
  Button,
  Card,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { HydrateSetData } from "../../../modules/hydrate-set-data";
import { CreateLearnData } from "../../../modules/create-learn-data";
import { useLearnContext } from "../../../stores/use-learn-store";
import { AnimatePresence, motion } from "framer-motion";
import { Term } from "@prisma/client";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useShortcut } from "../../../hooks/use-shortcut";
import { ChoiceShortcutLayer } from "../../../components/choice-shortcut-layer";

export default function Learn() {
  return (
    <HydrateSetData>
      <CreateLearnData>
        <Container maxW="4xl">
          <Stack spacing={8}>
            <Titlebar />
            <InteractionCard />
          </Stack>
        </Container>
        <IncorrectBar />
      </CreateLearnData>
    </HydrateSetData>
  );
}

const Titlebar = () => {
  const currentRound = useLearnContext((s) => s.currentRound);

  return (
    <Heading size="lg" textAlign="center">
      Round {currentRound + 1}
    </Heading>
  );
};

const InteractionCard = () => {
  const active = useLearnContext((s) => s.active);
  const answered = useLearnContext((s) => s.answered);
  const status = useLearnContext((s) => s.status);
  const answerCorrectly = useLearnContext((s) => s.answerCorrectly);
  const answerIncorrectly = useLearnContext((s) => s.answerIncorrectly);

  if (!active) return null;

  const choose = (term: Term) => {
    if (term.id === active.term.id) {
      answerCorrectly(term.id);
    } else {
      answerIncorrectly(term.id);
    }
  };

  const isCorrectTerm = (id: string) => !!answered && id === active.term.id;
  const isIncorrectTerm = (id: string) =>
    id === answered && status === "incorrect";

  const colorForTerm = (id: string) => {
    if (!answered) return "blue";

    if (isCorrectTerm(id)) return "green";
    else if (isIncorrectTerm(id)) return "red";

    return "blue";
  };

  const colorModeValue = (color: string) =>
    useColorModeValue(`${color}.600`, `${color}.200`);

  return (
    <motion.div
      key={active.term.id}
      initial={{ translateY: -20, opacity: 0.5 }}
      animate={{ translateY: 0, opacity: 1 }}
    >
      <Card px="8" py="6" shadow="2xl">
        <Stack spacing={6}>
          <Text textColor="gray.500" fontSize="sm" fontWeight={600}>
            Term
          </Text>
          <Box h={140}>
            <Text fontSize="xl">{active.term.word}</Text>
          </Box>
          <Stack spacing={4}>
            <Text fontWeight={600}>Choose matching definition</Text>
          </Stack>
          <Grid gridTemplateColumns="1fr 1fr" gap="6">
            <ChoiceShortcutLayer
              choose={(i) => {
                if (active.choices.length > i) choose(active.choices[i]!);
              }}
            />
            {active.choices.map((choice, i) => (
              <GridItem h="auto">
                <Button
                  w="full"
                  variant="outline"
                  pointerEvents={answered ? "none" : "auto"}
                  bg={
                    isCorrectTerm(choice.id)
                      ? useColorModeValue("green.200", "green.600")
                      : "transparent"
                  }
                  border="2px"
                  px="8"
                  py="5"
                  h="full"
                  colorScheme={colorForTerm(choice.id)}
                  isDisabled={
                    !!answered &&
                    choice.id !== active.term.id &&
                    choice.id !== answered
                  }
                  onClick={() => choose(choice)}
                >
                  <Flex alignItems="center" w="full" gap={4}>
                    <Flex
                      outline="solid 2px"
                      outlineColor={colorModeValue(colorForTerm(choice.id))}
                      rounded="full"
                      w="6"
                      h="6"
                      minW="6"
                      alignItems="center"
                      justifyContent="center"
                    >
                      {isCorrectTerm(choice.id) ? (
                        <IconCheck size={20} />
                      ) : isIncorrectTerm(choice.id) ? (
                        <IconX size={20} />
                      ) : (
                        <Text
                          fontSize="sm"
                          color={useColorModeValue("gray.800", "gray.200")}
                        >
                          {i + 1}
                        </Text>
                      )}
                    </Flex>
                    <Text
                      size="lg"
                      color={useColorModeValue("black", "white")}
                      whiteSpace="normal"
                      textAlign="start"
                      fontWeight="normal"
                    >
                      {choice.definition}
                    </Text>
                  </Flex>
                </Button>
              </GridItem>
            ))}
          </Grid>
        </Stack>
      </Card>
    </motion.div>
  );
};

const IncorrectBar = () => {
  const status = useLearnContext((s) => s.status);
  const acknowledgeIncorrect = useLearnContext((s) => s.acknowledgeIncorrect);

  return (
    <AnimatePresence>
      {status == "incorrect" && (
        <motion.div
          style={{ position: "fixed", bottom: 0, width: "100%" }}
          initial={{ translateY: 80 }}
          animate={{ translateY: 0 }}
          exit={{ translateY: 80 }}
        >
          <AnyKeyPressLayer onSubmit={acknowledgeIncorrect} />
          <Box w="full" bg={useColorModeValue("gray.200", "gray.800")}>
            <Container maxW="4xl" py="4">
              <Flex alignItems="center" justifyContent="space-between">
                <Text
                  fontSize="lg"
                  color={useColorModeValue("gray.600", "gray.400")}
                >
                  Press any key to continue
                </Text>
                <Button size="lg" onClick={acknowledgeIncorrect}>
                  Continue
                </Button>
              </Flex>
            </Container>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const AnyKeyPressLayer = ({ onSubmit }: { onSubmit: () => void }) => {
  useShortcut([], onSubmit, false, false, false, true);
  return null;
};

export { getServerSideProps } from "../../../components/chakra";
