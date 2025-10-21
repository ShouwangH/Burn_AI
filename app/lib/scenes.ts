export interface Scene {
  scene_id: string;
  title: string;
  year: string;
  place?: string;
  narration_text: string;
  image_prompt: string;
  image_url: string | null;
  audio_url: string;
  image_generation_status?: "ok" | "failed";
  image_attempts?: number;
}
