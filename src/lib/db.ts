import { supabase } from "./superbase";

export async function toggleBookmark(userId: string, postId: string) {
  const { data, error } = await supabase
    .from("interactions")
    .upsert(
      { user_id: userId, post_id: postId, bookmarked: true },
      { onConflict: "user_id,post_id" }
    );

  return { data, error };
}

export async function toggleLike(userId: string, postId: string) {
  console.log({ userId, postId }); // or bookmarked
  const { data, error } = await supabase
    .from("interactions")
    .upsert(
      { user_id: userId, post_id: postId, liked: true },
      { onConflict: "user_id,post_id" }
    );

  return { data, error };
}

export async function upsertInteraction(
  userId: string,
  postId: string,
  liked: boolean,
  bookmarked: boolean
) {
  const { data, error } = await supabase
    .from("interactions")
    .upsert(
      { user_id: userId, post_id: postId, liked, bookmarked },
      { onConflict: "user_id,post_id" }
    );

  if (error) console.error("Upsert error:", error.message);
  return { data, error };
}

export async function getUserInteractions(userId: string) {
  return await supabase
    .from('interactions')
    .select('post_id, liked, bookmarked')
    .eq('user_id', userId)
}

export async function upsertNote(userId: string, postId: string, note: string) {
  const { data, error } = await supabase
    .from("notes")
    .upsert(
      { user_id: userId, post_id: postId, note },
      { onConflict: "user_id,post_id" }
    );

  if (error) console.error("upsertNote error:", error.message);
  return { data, error };
}

export async function getUserNotes(userId: string) {
  return await supabase
    .from('notes')
    .select('post_id, note')
    .eq('user_id', userId)
}
