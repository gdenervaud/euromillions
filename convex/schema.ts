import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    clerkId: v.string(),
    name: v.string(),
    email: v.optional(v.string()),
    profileUrl: v.optional(v.string()),
    role: v.optional(v.string()),
    admin: v.optional(v.boolean()),
  }).index("by_name", ["name"])
    .index("by_clerk_id", ["clerkId"]),
  euromillions_draws: defineTable({
    date: v.string(),
    numbers: v.array(v.number()),
    stars: v.array(v.number()),
    swissWin: v.optional(v.array(v.number())),
  }).index("by_date", ["date"]),
  swisslotto_draws: defineTable({
    date: v.string(),
    numbers: v.array(v.number()),
    chance: v.optional(v.number()),
  }).index("by_date", ["date"]),
});
