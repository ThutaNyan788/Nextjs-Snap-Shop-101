"use server";

import { eq } from "drizzle-orm";
import {
  emailVerificationToken,   
  users,
} from "./schema";
import crypto from "crypto";
import { db } from ".";
const checkEmailVerificationToken = async (
  email: string | null,
  token?: string
) => {
  try {
    let verificationToken:
      | {
          id: string;
          email: string;
          token: string;
          expires: Date;
        }
      | undefined;

    if (email) {
      verificationToken = await db.query.emailVerificationToken.findFirst({
        where: eq(emailVerificationToken.email, email!),
      });
    }

    if (token) {
      verificationToken = await db.query.emailVerificationToken.findFirst({
        where: eq(emailVerificationToken.token, token),
      });
    }

    return verificationToken;
  } catch (err) {
    return null;
  }
};
export const generateEmailVericificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 30 * 60 * 1000);

  const existingToken = await checkEmailVerificationToken(email);

  if (existingToken) {
    await db
      .delete(emailVerificationToken)
      .where(eq(emailVerificationToken.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(emailVerificationToken)
    .values({
      email,
      token,
      expires,
    })
    .returning();

  return verificationToken;
};

export const confirmEmailWithToken = async (token: string) => {
  const existingToken = await checkEmailVerificationToken(null, token);
  if (!existingToken) return { error: "Invalid token" };

  const isExpired = new Date() > new Date(existingToken.expires);
  if (isExpired) return { error: "Expired token" };

  const existingUser = await db.query.users.findFirst({
    where: eq(users.email, existingToken.email),
  });
  if (!existingUser) return { error: "User not found" };

  await db
    .update(users)
    .set({
      emailVerified: new Date(),
      email: existingToken.email,
    })
    .where(eq(users.id, existingUser.id));

  await db
    .delete(emailVerificationToken)
    .where(eq(emailVerificationToken.id, existingToken.id));

  return { success: "Email verified" };
};


export const checkVerifyToken = async (token: string) => {
  const existingToken = await checkEmailVerificationToken(null, token);
  if (!existingToken) return { error: "Invalid token" };

  const isExpired = new Date() > new Date(existingToken.expires);
  if (isExpired) return { error: "Expired token" };

  
  await db
    .update(users)
    .set({
      emailVerified: new Date(),
    })
    .where(eq(users.email, existingToken.email));

  await  deleteEmailVerificationToken(token);
  return { success: "Valid token" };

}

export const deleteEmailVerificationToken = async (token: string) => {
  const existingToken = await checkEmailVerificationToken(null, token);
  if (!existingToken) return { error: "Invalid token" };

  await db
    .delete(emailVerificationToken)
    .where(eq(emailVerificationToken.id, existingToken.id));

  return { success: "Token deleted" };
};
