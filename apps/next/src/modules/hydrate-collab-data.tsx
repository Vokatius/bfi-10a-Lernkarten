import { useRouter } from "next/router";
import React from "react";

import { type RouterOutputs, api } from "@quenti/trpc";

import { editorEventChannel } from "../events/editor";
import { CollabEditorLayer } from "./collab/collab-editor-layer";

type CollabData = RouterOutputs["collab"]["get"];

export const CollabContext = React.createContext<
  { data: CollabData } | undefined
>(undefined);

export const HydrateCollabData: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter();
  const id = router.query.id as string;

  const [isDirty, setIsDirty] = React.useState(false);

  const { data, error, refetch } = api.collab.get.useQuery(
    {
      studySetId: id,
    },
    {
      enabled: !!id,
      onSuccess: () => {
        if (isDirty) setIsDirty(false);
      },
    },
  );

  React.useEffect(() => {
    if (!error) return;

    if (error.data?.code == "NOT_FOUND") {
      void router.push(`/${id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error]);

  React.useEffect(() => {
    const sub = () => {
      setIsDirty(true);
      void refetch();
    };

    editorEventChannel.on("refresh", sub);
    return () => {
      editorEventChannel.off("refresh", sub);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: loading skeleton
  if (!data || isDirty) return null;

  return (
    <CollabContext.Provider value={{ data }}>
      <CollabEditorLayer data={data}>{children}</CollabEditorLayer>
    </CollabContext.Provider>
  );
};