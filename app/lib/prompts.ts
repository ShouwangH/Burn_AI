import { jsonSchema } from 'ai';


export const systemPlanner = 'You are a documentary planner creating a fictional, Ken-Burns-style mini-history about a civil war. ' +
    'Your output must be plausible but fictional, respectful, and non-glorifying.' +
    'Use a calm, archival tone. Keep facts consistent within the story. Avoid real people, modern political groups, or identifiable living individuals.'

export const makeUserPrompt = (place: string) =>
    `Create a 30-60 second, 3-4 scene "Ken Burns" mini-documentary about a fictional civil war in ${place}.
Constraints:
- Duration: ~10-15 seconds per scene.
- Scenes: 3-4 total.
- No real modern politics, no explicit gore, no hate.
- Keep tense consistent (past).
- Each scene includes: narration_text (30-45 words), image_prompt ("sepia-toned", "3:2", "film grain" or "light film grain"), ken_burns semantic camera (move/speed/ease), music_mood.`;


export const documentary = jsonSchema<{
  title: string;
  logline: string;
  scenes: {
    scene_id: string;
    title: string;
    year: string;
    place: string;
    narration_text: string;
    image_prompt: string;
    camera: {
      move: "pan-establishing" | "pan-epic" | "zoom-in-intimate" | "zoom-in-somber" | "zoom-out-consequence";
      speed: "very-slow" | "slow" | "moderate";
      ease: "cubic-in-out" | "linear" | "ease-in" | "ease-out";
      focus_hint: string;
      start: { x: number; y: number; scale: number };
      end: { x: number; y: number; scale: number };
    };
    music_mood: string;
    duration_s: number;
  }[];
}>({
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "≤ 8 words, archival tone"
    },
    logline: {
      type: "string",
      description: "1 sentence hook, ≤ 24 words"
    },
    scenes: {
      type: "array",
      items: {
        type: "object",
        properties: {
          scene_id: { type: "string" },
          title: { type: "string", description: "≤ 6 words" },
          year: { type: "string", description: "historical year, e.g., '1863'" },
          place: { type: "string", description: "historical place, e.g., 'Old Port of …'" },
          narration_text: {
            type: "string",
            description: "30–45 words, Ken Burns tone, past tense, include one sensory detail, no dialogue"
          },
          image_prompt: {
            type: "string",
            description: "sepia-toned historical photo, light film grain, shallow depth of field, vignette, 3:2; describe subjects, props, composition, lighting"
          },
          camera: {
            type: "object",
            properties: {
              move: {
                type: "string",
                enum: ["pan-establishing","pan-epic","zoom-in-intimate","zoom-in-somber","zoom-out-consequence"],
                description: "choose one cinematic move"
              },
              speed: { type: "string", enum: ["very-slow","slow","moderate"] },
              ease: { type: "string", enum: ["cubic-in-out","linear","ease-in","ease-out"] },
              focus_hint: { type: "string", description: "short phrase focus hint, e.g., 'widow's hands'" },
              start: {
                type: "object",
                properties: {
                  x: { type: "number" },
                  y: { type: "number" },
                  scale: { type: "number" }
                },
                required: ["x","y","scale"]
              },
              end: {
                type: "object",
                properties: {
                  x: { type: "number" },
                  y: { type: "number" },
                  scale: { type: "number" }
                },
                required: ["x","y","scale"]
              }
            },
            required: ["move","speed","ease","focus_hint","start","end"]
          },
          music_mood: { type: "string", description: "simple phrase, e.g., 'sparse strings'" },
          duration_s: { type: "number", description: "scene duration in seconds (10–15 typical)" }
        },
        required: ["scene_id","title","year","place","narration_text","image_prompt","camera","music_mood","duration_s"]
      }
    }
  },
  required: ["title","logline","scenes"]
});

export const sceneSchema = jsonSchema<{
  scene_id: string;
  title: string;
  year: string;
  place: string;
  narration_text: string;
  image_prompt: string;
  camera: {
    move: string;
    speed: string;
    ease: string;
    focus_hint: string;
    start: { x: number; y: number; scale: number };
    end: { x: number; y: number; scale: number };
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
        move: { type: "string" },
        speed: { type: "string" },
        ease: { type: "string" },
        focus_hint: { type: "string" },
        start: { type: "object", properties: { x: { type: "number" }, y: { type: "number" }, scale: { type: "number" } }, required: ["x","y","scale"] },
        end: { type: "object", properties: { x: { type: "number" }, y: { type: "number" }, scale: { type: "number" } }, required: ["x","y","scale"] }
      },
      required: ["move","speed","ease","focus_hint","start","end"]
    },
    music_mood: { type: "string" },
    duration_s: { type: "number" }
  },
  required: ["scene_id","title","year","place","narration_text","image_prompt","camera","music_mood","duration_s"]
});