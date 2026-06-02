"use client";

/**
 * components/features/shared/file-upload-zone.tsx
 *
 * Reusable drag-and-drop file upload zone.
 * Uses CSS vars only — no new design tokens.
 */

import { useRef, useState, useCallback } from "react";
import { Upload, File as FileIcon, X } from "lucide-react";

interface FileUploadZoneProps {
  accept: string;            // e.g. ".mp3,.wav,.m4a"
  maxSizeMB: number;
  label: string;
  sublabel?: string;
  onFileSelected: (file: File) => void;
  disabled?: boolean;
}

export function FileUploadZone({
  accept,
  maxSizeMB,
  label,
  sublabel,
  onFileSelected,
  disabled = false,
}: FileUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const V = {
    primary:   "var(--primary)",
    card:      "var(--card)",
    border:    "var(--border)",
    muted:     "var(--muted)",
    mutedFg:   "var(--muted-foreground)",
    cardFg:    "var(--card-foreground)",
    destructive: "var(--destructive)",
  };

  const validate = useCallback(
    (file: File): string | null => {
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File exceeds ${maxSizeMB} MB limit`;
      }
      const ext = "." + file.name.split(".").pop()?.toLowerCase();
      const allowed = accept.split(",").map((a) => a.trim().toLowerCase());
      if (!allowed.includes(ext)) {
        return `Unsupported format. Accepted: ${accept}`;
      }
      return null;
    },
    [accept, maxSizeMB]
  );

  const handleFile = useCallback(
    (file: File) => {
      const err = validate(file);
      if (err) {
        setError(err);
        return;
      }
      setError(null);
      setSelectedFile(file);
      onFileSelected(file);
    },
    [validate, onFileSelected]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={onInputChange}
        disabled={disabled}
      />

      {selectedFile ? (
        /* Selected file preview */
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-2xl"
          style={{
            background: `color-mix(in oklch, ${V.primary} 8%, ${V.card})`,
            border: `1px solid color-mix(in oklch, ${V.primary} 30%, ${V.border})`,
          }}
        >
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
            style={{
              background: `color-mix(in oklch, ${V.primary} 15%, transparent)`,
            }}
          >
            <FileIcon className="h-5 w-5" style={{ color: V.primary }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate" style={{ color: V.cardFg }}>
              {selectedFile.name}
            </p>
            <p className="text-xs" style={{ color: V.mutedFg }}>
              {formatSize(selectedFile.size)}
            </p>
          </div>
          {!disabled && (
            <button
              onClick={clearFile}
              className="p-1.5 rounded-lg transition-colors hover:opacity-70"
              style={{ color: V.mutedFg }}
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      ) : (
        /* Drop zone */
        <button
          type="button"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); if (!disabled) setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className="w-full flex flex-col items-center gap-3 px-6 py-10 rounded-2xl border-2 border-dashed transition-all duration-200"
          style={{
            borderColor: dragging
              ? V.primary
              : error
              ? V.destructive
              : V.border,
            background: dragging
              ? `color-mix(in oklch, ${V.primary} 6%, ${V.card})`
              : V.card,
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.6 : 1,
          }}
        >
          <div
            className="flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-200"
            style={{
              background: dragging
                ? `color-mix(in oklch, ${V.primary} 20%, transparent)`
                : V.muted,
              transform: dragging ? "scale(1.08)" : "scale(1)",
            }}
          >
            <Upload
              className="h-6 w-6"
              style={{ color: dragging ? V.primary : V.mutedFg }}
            />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: V.cardFg }}>
              {label}
            </p>
            {sublabel && (
              <p className="text-xs mt-0.5" style={{ color: V.mutedFg }}>
                {sublabel}
              </p>
            )}
            <p className="text-xs mt-1" style={{ color: V.mutedFg }}>
              Max {maxSizeMB} MB · {accept}
            </p>
          </div>
        </button>
      )}

      {error && (
        <p className="text-xs font-medium px-1" style={{ color: V.destructive }}>
          ⚠ {error}
        </p>
      )}
    </div>
  );
}
