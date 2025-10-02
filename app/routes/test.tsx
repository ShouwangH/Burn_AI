import { useState } from "react";

export default function TestAudio() {
  const [text, setText] = useState("");
  const [instructions, setInstructions] = useState("Speak in a calm, archival documentary tone.");
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/tts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, instructions }),
    });

    const { audio_url } = await res.json();
    setAudioUrl(audio_url);
    setText("");
  };

  return (
    <div className="flex flex-col max-w-lg mx-auto py-12 gap-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          className="border rounded p-2"
          placeholder="Enter narration text..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <input
          className="border rounded p-2"
          placeholder="Optional instructions for voice style..."
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
        />
        <button type="submit" className="border rounded p-2 bg-gray-100">
          Generate Speech
        </button>
      </form>

      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} />
        </div>
      )}
    </div>
  );
}
