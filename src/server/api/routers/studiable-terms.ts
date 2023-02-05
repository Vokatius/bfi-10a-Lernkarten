import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const studiableTermsRouter = createTRPCRouter({
  put: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        experienceId: z.string(),
        correctness: z.number(),
        appearedInRound: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.studiableTerm.upsert({
        where: {
          userId_termId: {
            userId: ctx.session.user.id,
            termId: input.id,
          },
        },
        create: {
          userId: ctx.session.user.id,
          termId: input.id,
          experienceId: input.experienceId,
          correctness: input.correctness,
          appearedInRound: input.appearedInRound,
        },
        update: {
          correctness: input.correctness,
        },
      });
    }),
});
