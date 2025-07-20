import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("euromillions_draws").order("desc").collect();
  },
});

export const save = mutation({
  args: {
    date: v.string(),
    numbers: v.array(v.number()),
    stars: v.array(v.number()),
    swissWin: v.optional(v.array(v.number())),
  },
  handler: async (ctx, args) => {
    
    const existing = await ctx.db
      .query("euromillions_draws")
      .filter((q) => q.eq(q.field("date"), args.date))
      .first();
      
    if (existing) {
      await ctx.db.replace(existing._id, {
        date: args.date,
        numbers: args.numbers,
        stars: args.stars,
        swissWin: args.swissWin,
      });
    } else {
      await ctx.db.insert("euromillions_draws", {
        date: args.date,
        numbers: args.numbers,
        stars: args.stars,
        swissWin: args.swissWin,
      });
    }
  },
});

export const remove = mutation({
  args: { 
    id: v.string(),
    date: v.string() 
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("euromillions_draws")
      .filter((q) => q.eq(q.field("date"), args.date))
      .first();
      
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
