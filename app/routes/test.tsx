import { useState } from "react";

export default function ImageTest() {
  const [input, setInput] = useState("");
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place: input }),
    });

    const data = await res.json();
    console.log("server response:", data);

    if (Array.isArray(data.images)) {
      setImages(data.images.map((i: { image_url: string }) => i.image_url));
    } else {
      console.error("unexpected response", data);
    }

    setInput("");
  };

  return (
    <div className="flex flex-col w-full max-w-md py-12 mx-auto">
      <form onSubmit={handleSubmit} className="mb-4 flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Enter a place..."
          className="flex-1 border rounded p-2"
        />
        <button type="submit" className="px-4 py-2 border rounded">
          Generate
        </button>
      </form>

      <div className="flex flex-col gap-4">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`generated-${i}`}
            className="rounded shadow max-w-full"
          />
        ))}
      </div>
    </div>
  );
}
