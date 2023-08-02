import { Button, ButtonGroup, Text } from "@chakra-ui/react";
import { Modal } from "../../components/modal";
import { useOrganization } from "../../hooks/use-organization";
import { api } from "@quenti/trpc";

export interface RemoveStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

export const RemoveStudentModal: React.FC<RemoveStudentModalProps> = ({
  isOpen,
  onClose,
  id,
}) => {
  const org = useOrganization();
  const utils = api.useContext();
  const removeStudent = api.organizations.removeStudent.useMutation({
    onSuccess: async () => {
      onClose();
      await utils.organizations.getStudents.invalidate();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Body spacing="2">
          <Modal.Heading>Remove student</Modal.Heading>
          <Text>
            Are you sure you want to remove this student from the organization?
            Their account will not be deleted, but they will be removed from all
            classes created under the organization.
          </Text>
        </Modal.Body>
        <Modal.Divider />
        <Modal.Footer>
          <ButtonGroup>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button
              isLoading={removeStudent.isLoading}
              onClick={() =>
                removeStudent.mutate({
                  orgId: org!.id,
                  studentId: id,
                })
              }
            >
              Remove student
            </Button>
          </ButtonGroup>
        </Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};