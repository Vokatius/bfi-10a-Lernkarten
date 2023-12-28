import { useRouter } from "next/router";
import React from "react";

import { api } from "@quenti/trpc";

import {
  Box,
  Button,
  Flex,
  RangeSlider,
  RangeSliderFilledTrack,
  RangeSliderThumb,
  RangeSliderTrack,
  Stack,
  Text,
} from "@chakra-ui/react";

import { IconArrowRight } from "@tabler/icons-react";

import { useAssignment } from "../../../hooks/use-assignment";
import { ClassWizardLayout } from "../class-wizard-layout";
import { useProtectedRedirect } from "../use-protected-redirect";

export const AssignmentCollab = () => {
  const router = useRouter();
  const id = router.query.id as string;
  const assignmentId = router.query.assignmentId as string;

  const { data: assignment } = useAssignment();
  const _isLoaded = useProtectedRedirect();
  const isLoaded = _isLoaded && !!assignment;

  const editCollab = api.assignments.editCollab.useMutation({
    onSuccess: async () => {
      await router.push(`/classes/${id}/assignments/${assignmentId}/publish`);
    },
  });

  const [minTerms, setMinTerms] = React.useState(3);
  const [maxTerms, setMaxTerms] = React.useState(7);

  React.useEffect(() => {
    if (!isLoaded) return;
    setMinTerms(assignment?.studySet?.collab?.minTermsPerUser ?? 3);
    setMaxTerms(assignment?.studySet?.collab?.maxTermsPerUser ?? 7);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  return (
    <ClassWizardLayout
      title="Edit Collab"
      seoTitle="Edit Collab"
      currentStep={2}
      steps={4}
      description="Configure how you would like students to collaborate on your study set."
      isLoaded={isLoaded}
    >
      <Stack spacing="10">
        <Stack
          spacing="8"
          borderLeftWidth="2px"
          borderLeftColor="gray.200"
          _dark={{
            borderLeftColor: "gray.700",
          }}
          pl="6"
        >
          <Stack spacing="0">
            <Text fontSize="lg" fontWeight={500}>
              Minimum/maximum number of terms per user
            </Text>
            <Text
              fontSize="sm"
              color="gray.600"
              _dark={{
                color: "gray.400",
              }}
            >
              Students will need to contribute this many terms to submit the
              assignment.
            </Text>
          </Stack>
          <Box>
            <RangeSlider
              // eslint-disable-next-line jsx-a11y/aria-proptypes
              aria-label={["Min terms per member", "Max terms per member"]}
              display="block"
              value={[minTerms, maxTerms]}
              max={20}
              min={1}
              m="0"
              onChange={([min, max]) => {
                setMinTerms(min!);
                setMaxTerms(max!);
              }}
            >
              <RangeSliderTrack
                bg="gray.100"
                _dark={{
                  bg: "gray.700",
                }}
                h="2px"
                rounded="full"
              >
                <RangeSliderFilledTrack bg="blue.300" />
              </RangeSliderTrack>
              <Thumb index={0} value={minTerms} />
              <Thumb index={1} value={maxTerms} />
            </RangeSlider>
            <Flex
              w="full"
              justifyContent="space-between"
              color="gray.500"
              fontSize="sm"
            >
              <Text>0 terms</Text>
              <Text>20 terms</Text>
            </Flex>
          </Box>
        </Stack>
        <Button
          w="max"
          size="sm"
          rightIcon={<IconArrowRight size={18} />}
          alignSelf="end"
          isLoading={editCollab.isLoading}
          onClick={() => {
            editCollab.mutate({
              id: assignment!.studySet!.collab!.id,
              type: "Default",
              minTermsPerUser: minTerms,
              maxTermsPerUser: maxTerms,
            });
          }}
        >
          Next
        </Button>
      </Stack>
    </ClassWizardLayout>
  );
};

const Thumb: React.FC<{ index: number; value: number }> = ({
  index,
  value,
}) => {
  return (
    <RangeSliderThumb
      boxSize={8}
      borderWidth="2px"
      bg="white"
      borderColor="blue.300"
      _dark={{
        bg: "gray.800",
        borderColor: "blue.300",
      }}
      shadow="md"
      transitionProperty="transform,border-width"
      transitionDuration="normal"
      _active={{
        transform: `translateY(-50%) scale(1.3)`,
        borderWidth: "1.5px",
      }}
      index={index}
    >
      <Text
        color="gray.900"
        _dark={{
          color: "white",
        }}
        fontSize="xs"
        fontWeight={700}
        fontFamily="heading"
      >
        {value}
      </Text>
    </RangeSliderThumb>
  );
};
