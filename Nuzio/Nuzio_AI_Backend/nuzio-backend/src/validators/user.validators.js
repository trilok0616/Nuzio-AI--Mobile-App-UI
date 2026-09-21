const { z } = require("zod");

const languageLocationSchema = z.object({
  language: z.enum(["en", "hi"]),
  locationPermission: z.boolean(),
  location: z.object({
    city: z.string().trim().max(100).optional(),
    country: z.string().trim().max(100).optional(),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional()
  }).optional()
});

const professionSchema = z.object({
  profession: z.string().trim().min(1).max(80)
});

const interestsSchema = z.object({
  interests: z.array(z.string().trim().min(1).max(60)).min(1).max(20)
});

const voiceSchema = z.object({
  voice: z.enum(["aria", "kai", "meera"])
});

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  notifications: z.object({
    breakingNews: z.boolean().optional(),
    dailyBrief: z.boolean().optional(),
    productUpdates: z.boolean().optional()
  }).optional()
}).refine((data) => Object.keys(data).length > 0, {
  message: "At least one field is required"
});

module.exports = {
  languageLocationSchema,
  professionSchema,
  interestsSchema,
  voiceSchema,
  profileSchema
};
