"use server"; // don't forget to add this!

import { z } from "zod";
import { actionClient } from "./safe-action";
import { signUpSchema } from "@/type/typeSchema";
import { db } from ".";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";
import { generateEmailVericificationToken } from "./tokens";
import { sendEmail } from "./email";

export const registerUser = actionClient
  .schema(signUpSchema)
  .action(async ({ parsedInput: { name, email, password } }) => {
    // console.log({ name, email, password });

    try {
      const user = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, email),
      });

      if (user?.email) {
        if (!user?.emailVerified) {
          const verificationToken =await generateEmailVericificationToken(email);

          await sendEmail({
            name: user.name!,
            token: verificationToken[0]?.token,
            email: user.email,
          });
          return {
            success: "Email verification link sent",
          };
        }
        return {
          failure: "User already exists",
        };
      }

      // TODO : Hash the password before saving it to the database
      const hashedPassword = await bcrypt.hash(password, 10);
      let data = { name, email, password: hashedPassword };

      await db.insert(users).values(data);
      const verificationTokens = await generateEmailVericificationToken(email);
      const verificationToken = verificationTokens[0]?.token; // Extract the token string

      await sendEmail({
        name: data?.name!,
        token: verificationToken,
        email: data?.email!,
      });

      return {
        success: "Please check your email to verify your account",
      };
    } catch (error) {
      console.log("REGISTER_ACTION",error);
      
    }
  });
