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

export const documentary = {
    "title": "string (≤ 8 words)",
    "logline": "1 sentence hook (≤ 24 words)",
    "scenes": [
        {
            "scene_id": "s1",
            "title": "string (≤ 6 words)",
            "year": "string (e.g., 1863)",
            "place": "string (e.g., Old Port of ...)",
            "narration_text": "30–45 words, Burns tone, past tense, includes one small sensory detail; no dialogue.",
            "image_prompt": "sepia-toned historical photo, light film grain, shallow depth of field, vignette, 3:2, [describe subjects, composition, era props, lighting]",
            "camera": {
                "move": "pan-establishing | pan-epic | zoom-in-intimate | zoom-in-somber | zoom-out-consequence",
                "speed": "very-slow | slow | moderate",
                "ease": "cubic-in-out | linear | ease-in | ease-out",
                "focus_hint": "short phrase (e.g., 'harbor cranes right', 'widow's hands', 'parliament steps')",
                "start": { "x": 0.30, "y": 0.45, "scale": 1.05 },
                "end": { "x": 0.65, "y": 0.50, "scale": 1.18 }
            },
            "music_mood": "sparse strings",
            "duration_s": 12
        }
    ]
}