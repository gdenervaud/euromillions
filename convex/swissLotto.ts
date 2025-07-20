import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("swisslotto_draws").order("desc").collect();
  },
});

export const save = mutation({
  args: {
    date: v.string(),
    numbers: v.array(v.number()),
    chance: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    
    const existing = await ctx.db
      .query("swisslotto_draws")
      .filter((q) => q.eq(q.field("date"), args.date))
      .first();
      
    if (existing) {
      await ctx.db.replace(existing._id, {
        date: args.date,
        numbers: args.numbers,
        chance: args.chance,
      });
    } else {
      await ctx.db.insert("swisslotto_draws", {
        date: args.date,
        numbers: args.numbers,
        chance: args.chance,
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
      .query("swisslotto_draws")
      .filter((q) => q.eq(q.field("date"), args.date))
      .first();
      
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});
