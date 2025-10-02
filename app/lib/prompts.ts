import { jsonSchema } from 'ai';


export const systemPlanner = `you are a documentarian in the style of ken burns.

critical rules:
- tone: calm, archival, reflective. never sensational, never modern slang.
- perspective: always past tense, omniscient, rooted in human testimony.
- subject matter: every passage begins with a concrete, period-specific detail (a diary entry, a photograph, a telegram, a soldier’s boots, a widow’s letter). expand outward to the broader historical meaning. end with a restrained, reflective closing line.
- structure per scene:
  1. anchoring detail (time + place + object/person).
  2. temporal expansion (link detail to broader context, use compound sentences).
  3. reflective resonance (shorter line, understated, emotional but not editorial).
- sentence cadence: alternate short declaratives and longer, clause-rich sentences. finish each block with a gentle, conclusive rhythm.
- diction:
  - nouns: concrete, archival (ledger, dispatch, telegram, diary, boots, rails).
  - verbs: measured, weighty (endured, recorded, vanished, returned, persisted).
  - adjectives: sparse and subdued (quiet, faded, somber, endless).
- avoid:
  - abstractions without anchoring objects.
  - adjectives like “amazing,” “horrific,” “fantastic.”
  - modern politics, modern figures, or explicit gore.
  camera.keyframes = array of { percent, x, y, scale, opacity? }.
- percent are keyframe stops (0–100).
- x,y are pixel offsets for translate3d. They should range from 0-240. Switch up to a new one pretty often.
- scale shoudld be in range 0-2. do not repeat too often.
- Opacities should be in the 0-.05 or .95-1 range
- avoid using the same values too many times in a row`

    export const makeUserPrompt = (prompt: string) =>
    `Create a 30-60 second, 3-4 scene "Ken Burns" mini-documentary about ${prompt}.
Constraints:
- Duration: ~10-15 seconds per scene.
- Scenes: 3-4 total.
- No real modern politics, no explicit gore, no hate.
- Keep tense consistent (past).
- Each scene includes: narration_text (30-45 words), image_prompt (ALL images must be either sepia-toned or black and white in the style of early 20th-century photography, somber lighting,” “stark contrasts,” “dramatic shadows,” “archival photograph aesthetic.”), ken_burns semantic camera (move/speed/ease), music_mood.
- image_prompt (must be sepia-toned or black and white, with film grain, vignette, 3:2 ratio; archival/Ansel Adams aesthetic)
- use the camera.keyframes schema: an array of objects with {percent, x, y, scale, opacity?}.
-generate camera keyframes for a ken burns effect focusing on [subject].
the move should include either a zoom in or a zoom out combined with a pan (x,y ≠ 0).
-pans can be from 0-120 vary them all through the range`


export const sceneSchema = jsonSchema<{
  scene_id: string;
  title: string;
  year: string;
  place: string;
  narration_text: string;
  image_prompt: string;
  camera: {
    speed: string;
    ease: "ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear";
    keyframes: Array<{
      percent: number; // 0–100
      x: number;
      y: number;
      scale: number;
      opacity?: number; // optional for fade-in/out
    }>;
  };
  music_mood: string;
  duration_s: number;
}>({
  type: "object",
  properties: {
    scene_id: { type: "string" },
    title: { type: "string" },
    year: { type: "string" },
    place: { type: "string" },
    narration_text: { type: "string" },
    image_prompt: { type: "string" },
    camera: {
      type: "object",
      properties: {
        speed: { type: "string" },
        ease: { type: "string", enum: ["ease","ease-in","ease-out","ease-in-out","linear"] },
        keyframes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              percent: { type: "number" },
              x: { type: "number" },
              y: { type: "number" },
              scale: { type: "number" },
              opacity: { type: "number" }
            },
            required: ["percent","x","y","scale"]
          }
        }
      },
      required: ["speed","ease","keyframes"]
    },
    music_mood: { type: "string" },
    duration_s: { type: "number" }
  },
  required: [
    "scene_id",
    "title",
    "year",
    "place",
    "narration_text",
    "image_prompt",
    "camera",
    "music_mood",
    "duration_s"
  ]
});
