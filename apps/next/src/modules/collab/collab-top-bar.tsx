import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Button,
  Flex,
  HStack,
  Heading,
  Spinner,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

import { IconCircleCheck, IconUsersGroup } from "@tabler/icons-react";

import { editorEventChannel } from "../../events/editor";
import { useSetEditorContext } from "../../stores/use-set-editor-store";
import { plural } from "../../utils/string";
import { getRelativeTime } from "../../utils/time";
import { CollabContext } from "../hydrate-collab-data";

export const CollabTopBar = () => {
  const router = useRouter();
  const id = useSetEditorContext((s) => s.id);
  const savedAt = useSetEditorContext((s) => s.savedAt);
  const numTerms = useSetEditorContext((s) => s.serverTerms.length);
  const { submission } = React.useContext(CollabContext)!.data;
  const submitted = !!submission.submittedAt;

  const isSaving = useSetEditorContext((s) => s.isSaving);
  const isSavingRef = React.useRef(isSaving);
  isSavingRef.current = isSaving;

  const subTextColor = useColorModeValue("gray.600", "gray.400");

  const text = submitted
    ? `${plural(numTerms, "term")} submitted ${
        getRelativeTime(submission.submittedAt!) || "just now"
      }`
    : isSaving
      ? "Saving..."
      : `${plural(numTerms, "term")} saved ${
          getRelativeTime(savedAt) || "just now"
        }`;

  const submit = api.collab.submit.useMutation({
    onSuccess: async () => {
      await router.push(`/${id}`);
    },
  });
  const newAttempt = api.collab.newAttempt.useMutation({
    onSuccess: () => {
      editorEventChannel.emit("refresh");
    },
  });

  return (
    <HStack
      py="4"
      px="5"
      bg="white"
      rounded="xl"
      position="sticky"
      top="2"
      w={{ base: "calc(100% + 16px)", sm: "calc(100% + 40px)" }}
      ml={{ base: "-8px", sm: "-20px" }}
      zIndex="50"
      borderWidth="2px"
      transition="border-color 0.2s ease-in-out"
      borderColor="gray.100"
      _dark={{
        bg: "gray.800",
        borderColor: "gray.750",
      }}
      shadow="xl"
    >
      <Flex align="center" justify="space-between" w="full">
        <Stack>
          <HStack spacing="10px">
            {submitted ? (
              <IconCircleCheck size={18} />
            ) : (
              <IconUsersGroup size={18} />
            )}
            <Heading fontSize="lg">
              {submitted ? "Submitted" : "Collab"}
            </Heading>
          </HStack>
          <HStack color={subTextColor} spacing={4}>
            {isSaving && <Spinner size="sm" />}
            <Text fontSize="sm">{text}</Text>
          </HStack>
        </Stack>
        <Button
          fontWeight={700}
          isLoading={submit.isLoading || newAttempt.isLoading}
          onClick={() => {
            if (!submission.submittedAt) {
              submit.mutate({
                submissionId: submission.id,
              });
            } else {
              newAttempt.mutate({
                studySetId: id,
              });
            }
          }}
        >
          {submission.submittedAt ? "New attempt" : "Submit"}
        </Button>
      </Flex>
    </HStack>
  );
};