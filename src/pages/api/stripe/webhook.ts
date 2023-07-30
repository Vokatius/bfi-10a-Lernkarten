import { buffer } from "micro";
import type { NextApiRequest, NextApiResponse } from "next";
import type Stripe from "stripe";
import { z } from "zod";
import { env } from "../../../env/server.mjs";
import stripe from "../../../payments/stripe";
import { cancelOrganizationSubscription } from "../../../payments/subscription";
import { HttpError } from "../../../server/lib/http-error";
import { deactivateOrgDomain } from "../../../server/lib/orgs/domains";
import { disbandOrgStudents } from "../../../server/lib/orgs/students";
import { getErrorFromUnknown } from "../../../utils/error";

export const config = {
  api: {
    bodyParser: false,
  },
};

type WebhookHandler = (events: Stripe.Event) => void | Promise<void>;

const webhookHandlers: Record<string, WebhookHandler | undefined> = {
  "customer.subscription.deleted": async (event) => {
    const object = event.data.object as Stripe.Subscription;
    const metadata = z
      .object({ orgId: z.string().cuid2() })
      .safeParse(object.metadata);

    if (!metadata.success) {
      throw new HttpError({
        statusCode: 502,
        message: "Invalid metadata on subscription",
      });
    }

    try {
      await cancelOrganizationSubscription(metadata.data.orgId);
    } catch (_err) {
      const err = getErrorFromUnknown(_err);
      if (err.message == "No Organization found") {
        throw new HttpError({
          statusCode: 202,
          message: "Organization already deleted",
        });
      }

      throw err;
    }
    await deactivateOrgDomain(metadata.data.orgId);
    await disbandOrgStudents(metadata.data.orgId);
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "POST")
      throw new HttpError({ statusCode: 405, message: "Method not allowed" });

    const signature = req.headers["stripe-signature"];
    if (!signature)
      throw new HttpError({
        statusCode: 400,
        message: "Missing stripe-signature header",
      });

    if (!env.STRIPE_WEBHOOK_SECRET)
      throw new HttpError({
        statusCode: 500,
        message: "Missing STRIPE_WEBHOOK_SECRET",
      });

    const reqBuffer = await buffer(req);
    const payload = reqBuffer.toString();

    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    const handler = webhookHandlers[event.type];
    if (handler) {
      await handler(event);
    } else {
      throw new HttpError({
        statusCode: 202,
        message: `No registered handler for event type ${event.type}`,
      });
    }
  } catch (_err) {
    const err = getErrorFromUnknown(_err);
    console.error(`Webhook error: ${err.message}`);
    res.status(err.statusCode || 500).json({
      message: err.message,
      stack: !env.NEXT_PUBLIC_DEPLOYMENT ? err.stack : undefined,
    });

    return;
  }

  res.json({ received: true });
}