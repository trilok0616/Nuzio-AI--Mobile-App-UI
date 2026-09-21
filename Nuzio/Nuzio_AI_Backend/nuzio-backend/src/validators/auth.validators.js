const { z } = require("zod");

const registerSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(8).max(128)
});

const loginSchema = z.object({
  email: z.string().email().transform((v) => v.toLowerCase()),
  password: z.string().min(1)
});

const googleSchema = z.object({
  idToken: z.string().min(20)
});

const refreshSchema = z.object({
  refreshToken: z.string().min(40)
});

module.exports = { registerSchema, loginSchema, googleSchema, refreshSchema };
