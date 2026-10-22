"use client";
import { useEffect, useRef } from "react";
import { Icon } from "@/components/zine/Icon";

/**
 * Shell for the E-Library tools: a native <dialog> (focus trapped, Escape closes),
 * zine header with a step bar, scrollable body.
 */
export function ToolDialog({
  label,
  title,
  icon,
  subtitle,
  closeLabel,
  progress,
  onClose,
  children,
}: {
  label: string;
  title: string;
  icon: string;
  subtitle: string;
  closeLabel: string;
  progress?: { value: number; max: number; text?: string; aside?: string };
  onClose: () => void;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);

  // No close() in a cleanup: that fires the close event, which would unmount the tool
  // straight away under StrictMode's double effect run. The element goes with the component.
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="z-tool"
      aria-labelledby="z-tool-title"
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
    >
      <div className="z-tool__head">
        <button type="button" className="z-tool__close" onClick={onClose} aria-label={closeLabel}><Icon name="close" /></button>
        <span className="z-mono">{label}</span>
        <h2 id="z-tool-title"><Icon name={icon} fill /> {title}</h2>
        <p>{subtitle}</p>
        {progress && (
          <div className="z-tool__progress">
            {(progress.text || progress.aside) && (
              <div className="z-tool__progresstext z-mono"><span>{progress.text}</span><span>{progress.aside}</span></div>
            )}
            <div className="z-tool__bar" role="progressbar" aria-valuemin={0} aria-valuemax={progress.max} aria-valuenow={progress.value}>
              <i style={{ width: `${(progress.value / progress.max) * 100}%` }} />
            </div>
          </div>
        )}
      </div>
      <div className="z-tool__body">{children}</div>
    </dialog>
  );
}

/** Copy-or-share helper; returns true when the text went to the clipboard. */
export async function shareText(title: string, text: string): Promise<boolean> {
  if (navigator.share) {
    try { await navigator.share({ title, text }); } catch { /* user cancelled */ }
    return false;
  }
  await navigator.clipboard.writeText(text);
  return true;
}
