import { useState } from "react";
import api from "../api/axios";

export default function Home() {
  const [files, setFiles] = useState([
    {
      id: Date.now(),
      filename: "index.html",
      code: "",
    },
  ]);

  const [active, setActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);

  const addTab = () => {
    setFiles((prev) => [
      ...prev,
      {
        id: Date.now(),
        filename: "file.js",
        code: "",
      },
    ]);
    setActive(files.length);
  };

  const updateFile = (key, value) => {
    setFiles((prev) => {
      const copy = [...prev];
      copy[active][key] = value;
      return copy;
    });
  };

  const deleteTab = (index) => {
    if (files.length === 1) return;

    setFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);

      if (index === active) setActive(Math.max(0, active - 1));
      else if (index < active) setActive((a) => a - 1);

      return updated;
    });
  };

  const submit = async () => {
    if (files.some((f) => !f.code.trim())) {
      return alert("Every file must contain code");
    }

    setLink("");
    setCopied(false);
    setLoading(true);

    try {
      const res = await api.post("/code/format", { files });

      const slug = res.data.slug;

      // ✅ THE FIX
      const fullLink = `${window.location.origin}/code/${slug}`;

      setLink(fullLink);
    } catch {
      alert("Formatting failed");
    }

    setLoading(false);
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-gray-200">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 backdrop-blur bg-[#0d1117]/80 border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 flex items-center justify-between">
          {/* LEFT BRAND */}
          <div className="flex items-center gap-3">
            {/* Logo */}
            <div
              className="w-9 h-9 rounded-lg bg-linear-to-br from-green-500 to-black-400
                      flex items-center justify-center text-white font-bold"
            >
              {". /"}
            </div>

            {/* Brand text */}
            <div>
              <h1 className="text-lg sm:text-xl font-semibold tracking-wide">
                Codunk
              </h1>
              <p className="text-xs text-gray-400 leading-tight">
                AI Multi-File Code Share
              </p>
            </div>
          </div>

          {/* RIGHT ACTION */}
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-gray-400">
              Powered by AI
            </span>

            <a
              href="https://github.com/Shikhar3x"
              target="_blank"
              rel="noreferrer"
              className="text-sm px-4 py-1.5 rounded-md
                   border border-gray-700
                   hover:border-gray-500
                   hover:bg-gray-800 transition"
            >
              🔭 GitHub
            </a>
          </div>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-6xl mx-auto mt-4 sm:mt-8 bg-[#161b22] rounded-xl border border-gray-800 shadow-lg">
        {/* LOADING BAR */}
        {loading && (
          <div className="h-1 w-full bg-gray-800 overflow-hidden rounded-t-xl">
            <div className="h-full bg-green-600 animate-pulse w-2/3"></div>
          </div>
        )}

        {/* TABS */}
        <div className="flex items-center border-b border-gray-800 px-2 sm:px-4 overflow-x-auto">
          {files.map((file, i) => (
            <div
              key={file.id}
              onClick={() => setActive(i)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-3
                cursor-pointer text-xs sm:text-sm whitespace-nowrap
                ${
                  active === i
                    ? "border-b-2 border-blue-500 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
            >
              <span>{file.filename}</span>

              <span
                onClick={(e) => {
                  e.stopPropagation();
                  deleteTab(i);
                }}
                className="ml-1 hover:text-red-400"
              >
                ×
              </span>
            </div>
          ))}

          <button
            onClick={addTab}
            title="New file"
            className="ml-2 w-9 h-9 rounded-md text-lg text-gray-400
              hover:bg-[#0d1117] hover:text-white transition"
          >
            +
          </button>
        </div>

        {/* Filename */}
        <div className="px-4 sm:px-6 pt-4">
          <input
            value={files[active].filename}
            onChange={(e) => updateFile("filename", e.target.value)}
            className="bg-[#0d1117] border border-gray-700
              rounded px-3 py-2 w-full sm:w-64
              text-xs sm:text-sm font-mono
              outline-none focus:border-blue-500"
          />
        </div>

        {/* Editor */}
        <div className="px-4 sm:px-6 py-4">
          <textarea
            className="w-full h-80 sm:h-105
              bg-[#0d1117] border border-gray-700
              rounded-lg p-4 font-mono
              text-xs sm:text-sm resize-none
              outline-none focus:border-blue-500"
            placeholder="Paste your code here..."
            value={files[active].code}
            onChange={(e) => updateFile("code", e.target.value)}
          />
        </div>

        {/* FOOTER */}
        <div className="px-4 sm:px-6 py-5 border-t border-gray-800">
          <button
            onClick={submit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-60
              text-white px-6 py-2 rounded-md
              text-sm font-medium transition"
          >
            {loading ? "Formatting..." : "Generate Share Link"}
          </button>

          {/* SUCCESS PANEL */}
          {link && (
            <div className="mt-5 bg-[#0d1117] border border-gray-700 rounded-lg p-4 space-y-3">
              <p className="text-sm text-green-400">
                🐸 Share Link Created Successfully.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                <input
                  readOnly
                  value={link}
                  className="w-full bg-transparent border border-gray-700
                    px-3 py-2 rounded text-xs sm:text-sm"
                />

                <div className="flex gap-3">
                  <button
                    onClick={copyLink}
                    className="px-4 py-2 bg-gray-800 rounded
                      hover:bg-gray-700 text-sm"
                  >
                    {copied ? "✓ Copied" : "Copy"}
                  </button>

                  <a
                    href={link}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 rounded
                      hover:bg-blue-500 text-sm text-white"
                  >
                    Open
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
