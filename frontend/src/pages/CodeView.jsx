import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";

export default function CodeView() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [active, setActive] = useState(0);

  const [copied, setCopied] = useState(false);
  const [copiedOriginal, setCopiedOriginal] = useState(false);

  useEffect(() => {
    api.get(`/code/${slug}`).then((res) => {
      setProject(res.data);
    });
  }, [slug]);

  useEffect(() => {
    if (project) Prism.highlightAll();
  }, [project, active]);

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex items-center justify-center text-gray-400">
        Loading…
      </div>
    );
  }

  const file = project.files[active];

  const copyAI = async () => {
    await navigator.clipboard.writeText(file.formattedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copyOriginal = async () => {
    await navigator.clipboard.writeText(file.code);
    setCopiedOriginal(true);
    setTimeout(() => setCopiedOriginal(false), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0b0f14] text-gray-200">
      {/* NAVBAR */}
      <div className="sticky top-0 z-50 bg-[#0b0f14]/90 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-md bg-linear-to-br from-green-400 to-black-400
              flex items-center justify-center text-white font-bold text-sm"
            >
              {". /"}
            </div>

            <div>
              <h1 className="text-base font-semibold tracking-wide">Codunk</h1>
              <p className="text-[11px] text-gray-500">Shared Code</p>
            </div>
          </div>

          <a
            href="/"
            className="text-xs px-4 py-1.5 rounded-md
              bg-white/5 hover:bg-white/10
              border border-white/10 transition"
          >
            Create new
          </a>
        </div>
      </div>

      {/* MAIN */}
      <div className="max-w-7xl mx-auto mt-6 px-4">
        {/* FILE TABS */}
        <div className="flex gap-1 overflow-x-auto mb-5">
          {project.files.map((f, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`px-4 py-2 text-xs rounded-md whitespace-nowrap transition
                ${
                  active === i
                    ? "bg-white/10 text-white"
                    : "text-gray-400 hover:bg-white/5"
                }`}
            >
              {f.filename}
            </button>
          ))}
        </div>

        {/* SPLIT VIEW */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* ORIGINAL */}
          <div className="bg-[#11161d] rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 text-xs text-gray-400 border-b border-white/5">
              <span>Original</span>

              <button
                onClick={copyOriginal}
                className="px-3 py-1 rounded-md text-xs
                  bg-white/5 hover:bg-white/10
                  border border-white/10 transition"
              >
                {copiedOriginal ? "✓ Copied" : "Copy"}
              </button>
            </div>

            <pre className="p-4 text-xs sm:text-sm bg-[#0b0f14] overflow-auto h-130">
              <code className={`language-${file.language}`}>{file.code}</code>
            </pre>
          </div>

          {/* AI */}
          <div className="bg-[#11161d] rounded-xl shadow-lg overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 border-b border-white/5">
              <span className="text-xs font-semibold text-emerald-400">
                AI Cleaned
              </span>

              <button
                onClick={copyAI}
                className="text-xs px-3 py-1.5 rounded-md
                  bg-white/5 hover:bg-white/10
                  border border-white/10 transition"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>

            <pre className="p-4 text-xs sm:text-sm bg-[#0b0f14] overflow-auto h-130">
              <code className={`language-${file.language}`}>
                {file.formattedCode}
              </code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
