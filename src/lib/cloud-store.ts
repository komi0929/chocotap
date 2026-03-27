"use client";

import { supabase } from "./supabase";
import type { User } from "@supabase/supabase-js";

/* =============================================
   Cloud Store — Supabase DB + Storage
   For authenticated users only
   ============================================= */

export interface CloudCheckin {
  id: string;
  shop_name: string;
  prefecture: string;
  memo: string | null;
  created_at: string;
}

export interface CloudPhoto {
  id: string;
  checkin_id: string;
  storage_path: string;
  caption: string | null;
  created_at: string;
  url?: string; // computed public URL
}

/* ========== Checkins ========== */

export async function getCheckins(userId: string): Promise<CloudCheckin[]> {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) { console.error("getCheckins error:", error); return []; }
  return data || [];
}

export async function getCheckin(userId: string, shopName: string): Promise<CloudCheckin | null> {
  const { data, error } = await supabase
    .from("checkins")
    .select("*")
    .eq("user_id", userId)
    .eq("shop_name", shopName)
    .single();
  if (error) return null;
  return data;
}

export async function createCheckin(
  userId: string,
  shopName: string,
  prefecture: string
): Promise<CloudCheckin | null> {
  const { data, error } = await supabase
    .from("checkins")
    .insert({ user_id: userId, shop_name: shopName, prefecture })
    .select()
    .single();
  if (error) { console.error("createCheckin error:", error); return null; }
  return data;
}

export async function deleteCheckin(userId: string, shopName: string): Promise<boolean> {
  const { error } = await supabase
    .from("checkins")
    .delete()
    .eq("user_id", userId)
    .eq("shop_name", shopName);
  if (error) { console.error("deleteCheckin error:", error); return false; }
  return true;
}

export async function updateCheckinMemo(
  checkinId: string,
  memo: string
): Promise<boolean> {
  const { error } = await supabase
    .from("checkins")
    .update({ memo })
    .eq("id", checkinId);
  if (error) { console.error("updateMemo error:", error); return false; }
  return true;
}

/* ========== Photos ========== */

export async function getPhotos(checkinId: string): Promise<CloudPhoto[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*")
    .eq("checkin_id", checkinId)
    .order("created_at", { ascending: true });
  if (error) { console.error("getPhotos error:", error); return []; }
  return (data || []).map((p) => ({
    ...p,
    url: getPhotoPublicUrl(p.storage_path),
  }));
}

export async function getAllUserPhotos(userId: string): Promise<(CloudPhoto & { shop_name: string; prefecture: string })[]> {
  const { data, error } = await supabase
    .from("photos")
    .select("*, checkins!inner(shop_name, prefecture)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) { console.error("getAllUserPhotos error:", error); return []; }
  return (data || []).map((p: Record<string, unknown>) => {
    const checkin = p.checkins as Record<string, string>;
    return {
      id: p.id as string,
      checkin_id: p.checkin_id as string,
      user_id: userId,
      storage_path: p.storage_path as string,
      caption: p.caption as string | null,
      created_at: p.created_at as string,
      shop_name: checkin.shop_name,
      prefecture: checkin.prefecture,
      url: getPhotoPublicUrl(p.storage_path as string),
    };
  });
}

export async function uploadPhoto(
  userId: string,
  checkinId: string,
  file: File
): Promise<CloudPhoto | null> {
  // Upload to storage
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${userId}/${checkinId}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("checkin-photos")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    console.error("Upload error:", uploadError);
    return null;
  }

  // Insert photo record
  const { data, error } = await supabase
    .from("photos")
    .insert({
      checkin_id: checkinId,
      user_id: userId,
      storage_path: path,
    })
    .select()
    .single();

  if (error) {
    console.error("Photo insert error:", error);
    return null;
  }

  return { ...data, url: getPhotoPublicUrl(path) };
}

export async function deletePhoto(photoId: string, storagePath: string): Promise<boolean> {
  // Delete from storage
  await supabase.storage.from("checkin-photos").remove([storagePath]);

  // Delete record
  const { error } = await supabase
    .from("photos")
    .delete()
    .eq("id", photoId);

  if (error) { console.error("deletePhoto error:", error); return false; }
  return true;
}

function getPhotoPublicUrl(path: string): string {
  const { data } = supabase.storage.from("checkin-photos").getPublicUrl(path);
  return data.publicUrl;
}

/* ========== Sync: Local → Cloud ========== */

export async function syncLocalToCloud(user: User) {
  // Import local store dynamically to avoid circular deps
  const localStore = await import("./store");
  const localCheckins = localStore.getAllCheckins();

  if (localCheckins.length === 0) return;

  for (const local of localCheckins) {
    // Check if already exists in cloud
    const existing = await getCheckin(user.id, local.shopName);
    if (existing) continue;

    // Create checkin in cloud
    const cloudCheckin = await createCheckin(user.id, local.shopName, local.prefecture);
    if (!cloudCheckin) continue;

    // Upload local photos to cloud
    for (const photo of local.photos) {
      try {
        // Convert data URL to File
        const res = await fetch(photo.dataUrl);
        const blob = await res.blob();
        const file = new File([blob], `${photo.id}.jpg`, { type: "image/jpeg" });
        await uploadPhoto(user.id, cloudCheckin.id, file);
      } catch (e) {
        console.error("Photo sync error:", e);
      }
    }
  }
}

/* ========== Profile ========== */

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) return null;
  return data;
}

export async function updateProfile(userId: string, updates: { display_name?: string; avatar_url?: string }) {
  const { error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId);
  return !error;
}
