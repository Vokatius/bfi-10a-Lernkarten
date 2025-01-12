import { useSession } from "next-auth/react";

import type { RouterOutputs } from "@quenti/trpc";

import {
  HStack,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconClockPlay } from "@tabler/icons-react";

import { UsernameLink } from "../../components/username-link";
import { formatDeciseconds } from "../../utils/time";

interface MatchSummaryFeedbackProps {
  elapsed: number;
  eligible: boolean;
  highscore: RouterOutputs["leaderboard"]["highscore"];
  highscores: RouterOutputs["leaderboard"]["byEntityId"]["highscores"];
}

export const MatchSummaryFeedback: React.FC<MatchSummaryFeedbackProps> = ({
  elapsed,
  eligible,
  highscore,
  highscores,
}) => {
  const session = useSession();
  const userId = session.data!.user!.id;

  const text = eligible
    ? leaderboardSummary(elapsed, userId, highscores)
    : personalSummary(elapsed, highscore);

  const textColor = useColorModeValue("gray.500", "gray.400");

  return (
    <Stack>
      <HStack spacing="3">
        <IconClockPlay />
        <Heading>{`${formatDeciseconds(elapsed)}s`}</Heading>
      </HStack>
      <Text fontWeight={600} color={textColor}>
        {text}
      </Text>
    </Stack>
  );
};

const leaderboardSummary = (
  elapsed: number,
  userId: string,
  highscores: MatchSummaryFeedbackProps["highscores"],
): React.ReactNode => {
  const selfIndex = highscores.findIndex((h) => h.userId == userId);
  const personal = highscores[selfIndex]!;
  const isPr = elapsed == personal.time;
  const successor = highscores[Math.max(selfIndex - 1, 0)]!;

  if (!isPr) {
    return `Versuche deinen Rekord von ${formatDeciseconds(
      personal.time!,
    )} Sekunden zu überbieten.`;
  } else if (successor.userId != userId) {
    return (
      <>
        Versuche{" "}
        <UsernameLink username={successor.user.username} color="blue.300" />
        &apos;{!successor.user.username?.toLowerCase().endsWith("s")
          ? "s"
          : ""}{" "}
        Bestzeit von {formatDeciseconds(successor.time)} Sekunden zu schlagen.
      </>
    );
  } else {
    return `Du bist #1!`;
  }
};

const personalSummary = (
  elapsed: number,
  highscore: MatchSummaryFeedbackProps["highscore"],
) => {
  const isPr = elapsed == highscore.bestTime;

  if (!isPr) {
    return `Versuche deinen Rekord von ${formatDeciseconds(
      highscore.bestTime!,
    )} Sekunden zu überbieten.`;
  } else {
    return `Meinst du ${formatDeciseconds(
      highscore.bestTime!,
    )} Sekunden schlagen zu können?`;
  }
};
