import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Credits management
  credits: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const { getUserCredits, initializeUserCredits } = await import("./db");
      let credits = await getUserCredits(ctx.user.id);
      
      // Initialize credits if user doesn't have any
      if (!credits) {
        await initializeUserCredits(ctx.user.id, 0);
        credits = await getUserCredits(ctx.user.id);
      }
      
      return credits;
    }),
    
    purchase: protectedProcedure
      .input(z.object({
        amount: z.number().min(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const { addCredits } = await import("./db");
        await addCredits(ctx.user.id, input.amount);
        return { success: true };
      }),
  }),
  
  // Niche analysis
  analysis: router({
    niches: publicProcedure.query(() => {
      const { NICHES } = require("./nicheAnalysis");
      return NICHES;
    }),
    
    generate: protectedProcedure
      .input(z.object({
        niche: z.string(),
        location: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { deductCredit, createReport, getUserCredits } = await import("./db");
        const { analyzeNiche } = await import("./nicheAnalysis");
        
        // Check if user has credits
        const credits = await getUserCredits(ctx.user.id);
        if (!credits || credits.credits <= 0) {
          throw new Error("Insufficient credits. Please purchase more credits to generate reports.");
        }
        
        // Deduct credit
        const deducted = await deductCredit(ctx.user.id);
        if (!deducted) {
          throw new Error("Failed to deduct credit");
        }
        
        // Generate analysis
        const analysis = await analyzeNiche(input);
        
        // Save report
        await createReport({
          userId: ctx.user.id,
          niche: input.niche,
          location: input.location,
          opportunityScore: analysis.opportunityScore,
          searchVolume: analysis.searchVolume,
          avgCpc: analysis.avgCpc,
          competitionLevel: analysis.competitionLevel,
          keywords: JSON.stringify(analysis.keywords),
          competitors: JSON.stringify(analysis.competitors),
          domains: JSON.stringify(analysis.domains),
          revenueProjection: analysis.revenueProjection,
        });
        
        return analysis;
      }),
  }),
  
  // Reports management
  reports: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      const { getUserReports } = await import("./db");
      const reports = await getUserReports(ctx.user.id);
      
      return reports.map(report => ({
        ...report,
        keywords: JSON.parse(report.keywords),
        competitors: JSON.parse(report.competitors),
        domains: JSON.parse(report.domains),
      }));
    }),
    
    get: protectedProcedure
      .input(z.object({
        id: z.number(),
      }))
      .query(async ({ ctx, input }) => {
        const { getReportById } = await import("./db");
        const report = await getReportById(input.id, ctx.user.id);
        
        if (!report) {
          throw new Error("Report not found");
        }
        
        return {
          ...report,
          keywords: JSON.parse(report.keywords),
          competitors: JSON.parse(report.competitors),
          domains: JSON.parse(report.domains),
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
