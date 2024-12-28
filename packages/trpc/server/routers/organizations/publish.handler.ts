import { APP_URL } from "@quenti/lib/constants/url";
import { TRPCError } from "@trpc/server";

import { conflictingDomains, getOrgDomains } from "../../lib/orgs/domains";
import { isOrganizationAdmin } from "../../lib/queries/organizations";
import type { NonNullableUserContext } from "../../lib/types";
import type { TPublishSchema } from "./publish.schema";

type PublishOptions = {
  ctx: NonNullableUserContext;
  input: TPublishSchema;
};

export const publishHandler = async ({ ctx, input }: PublishOptions) => {
  if (!(await isOrganizationAdmin(ctx.session.user.id, input.orgId))) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  const org = (await ctx.prisma.organization.findUnique({
    where: { id: input.orgId },
    include: { members: true },
  }))!;

  const domains = await getOrgDomains(org.id);
  if (!domains.length || domains.find((d) => !d.verifiedAt))
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "All domains must be verified before publishing",
    });

  const conflicting = await conflictingDomains(
    org.id,
    domains.map((d) => d.requestedDomain),
  );
  if (!!conflicting.length) {
    throw new TRPCError({
      code: "CONFLICT",
      message: "Conflicting domains",
    });
  }

  return {
    callback: `${APP_URL}/orgs/${org.id}?upgrade=success`,
  };
};

export default publishHandler;
