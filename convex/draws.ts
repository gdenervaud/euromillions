import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { collection: v.string() },
  handler: async (ctx, args) => {
    if (args.collection === "euromillions_draws") {
      return await ctx.db.query("euromillions_draws").order("desc").collect();
    } else if (args.collection === "swisslotto_draws") {
      return await ctx.db.query("swisslotto_draws").order("desc").collect();
    }
    throw new Error(`Unknown collection: ${args.collection}`);
  },
});

export const save = mutation({
  args: {
    collection: v.string(),
    id: v.string(),
    date: v.string(),
    numbers: v.array(v.number()),
    stars: v.optional(v.array(v.number())),
    swissWin: v.optional(v.array(v.number())),
    chance: v.optional(v.number()),
    lastUpdated: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const { collection, id, lastUpdated, ...rest } = args;
    
    if (collection === "euromillions_draws") {
      const existing = await ctx.db.query("euromillions_draws").filter((q) => q.eq(q.field("date"), rest.date)).first();
      if (existing) {
        await ctx.db.replace(existing._id, { 
          date: rest.date,
          numbers: rest.numbers,
          stars: rest.stars || [],
          swissWin: rest.swissWin
        });
      } else {
        await ctx.db.insert("euromillions_draws", {
          date: rest.date,
          numbers: rest.numbers,
          stars: rest.stars || [],
          swissWin: rest.swissWin
        });
      }
    } else if (collection === "swisslotto_draws") {
      const existing = await ctx.db.query("swisslotto_draws").filter((q) => q.eq(q.field("date"), rest.date)).first();
      if (existing) {
        await ctx.db.replace(existing._id, {
          date: rest.date,
          numbers: rest.numbers,
          chance: rest.chance
        });
      } else {
        await ctx.db.insert("swisslotto_draws", {
          date: rest.date,
          numbers: rest.numbers,
          chance: rest.chance
        });
      }
    } else {
      throw new Error(`Unknown collection: ${collection}`);
    }
  },
});

export const remove = mutation({
  args: { collection: v.string(), date: v.string() },
  handler: async (ctx, args) => {
    if (args.collection === "euromillions_draws") {
      const existing = await ctx.db.query("euromillions_draws").filter((q) => q.eq(q.field("date"), args.date)).first();
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    } else if (args.collection === "swisslotto_draws") {
      const existing = await ctx.db.query("swisslotto_draws").filter((q) => q.eq(q.field("date"), args.date)).first();
      if (existing) {
        await ctx.db.delete(existing._id);
      }
    } else {
      throw new Error(`Unknown collection: ${args.collection}`);
    }
  },
});
