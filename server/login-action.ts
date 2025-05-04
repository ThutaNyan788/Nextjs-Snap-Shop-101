"use server"; // don't forget to add this!

import { z } from "zod";
import { actionClient } from "./safe-action";
import { loginSchema } from "@/type/typeSchema";

export const loginUser = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
   
      return {
        success: "Successfully logged in",
      };
    

    return { failure: "Incorrect credentials" };
  });