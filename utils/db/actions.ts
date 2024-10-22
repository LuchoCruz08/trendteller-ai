"use server"

import { db } from "./dbConfig";
import { Users, GeneratedContent } from "./schema";
import { eq, sql, desc } from "drizzle-orm";

export async function updateUserPoints(userId: number, points: number) {
  try {
    const [updatedUser] = await db
      .update(Users)
      .set({ points: sql`${Users.points} + ${points}` })
      .where(eq(Users.id, userId))
      .returning()
      .execute();
    return updatedUser;
  } catch (error) {
    console.error("Error updating user points:", error);
    return null;
  }
}

export async function getUserPoints(userId: number) {
  try {
    console.log("Fetching points for user:", userId);
    const users = await db
      .select({ points: Users.points, id: Users.id, email: Users.email })
      .from(Users)
      .where(eq(Users.id, userId))
      .execute();
    console.log("Fetched users:", users);
    if (users.length === 0) {
      console.log("No user found with id:", userId);
      return 0;
    }
    return users[0].points || 0;
  } catch (error) {
    console.error("Error fetching user points:", error);
    return 0;
  }
}

export async function saveGeneratedContent(
  userId: number,
  content: string,
  prompt: string,
  contentType: string
) {
  try {
    const [savedContent] = await db
      .insert(GeneratedContent)
      .values({
        userId,
        content,
        prompt,
        contentType,
      })
      .returning()
      .execute();
    return savedContent;
  } catch (error) {
    console.error("Error saving generated content:", error);
    return null;
  }
}

export async function getGeneratedContentHistory(
  userId: number,
  limit: number = 10
) {
  try {
    const history = await db
      .select({
        id: GeneratedContent.id,
        content: GeneratedContent.content,
        prompt: GeneratedContent.prompt,
        contentType: GeneratedContent.contentType,
        createdAt: GeneratedContent.createdAt,
      })
      .from(GeneratedContent)
      .where(eq(GeneratedContent.userId, userId))
      .orderBy(desc(GeneratedContent.createdAt))
      .limit(limit)
      .execute();
    return history;
  } catch (error) {
    console.error("Error fetching generated content history:", error);
    return [];
  }
}

export async function createOrUpdateUser(email: string, name: string) {
  try {
    console.log("Creating or updating user:", email, name);

    const [userWithEmail] = await db
      .select()
      .from(Users)
      .where(eq(Users.email, email))
      .limit(1)
      .execute();

    if (userWithEmail) {
      const [updatedUser] = await db
        .update(Users)
        .set({ name })
        .where(eq(Users.email, email))
        .returning()
        .execute();
      console.log("Updated user:", updatedUser);
      return updatedUser;
    }

    const [newUser] = await db
      .insert(Users)
      .values({ email, name, points: 50 })
      .returning()
      .execute();
    console.log("New user created:", newUser);
    return newUser;
  } catch (error) {
    console.error("Error creating or updating user:", error);
    return null;
  }
}
