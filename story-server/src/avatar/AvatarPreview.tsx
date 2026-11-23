import { getShapeStyle } from "./generateCSS";
import { AVATAR_SIZE } from "./types";
import type { AvatarDocument } from "./types";

type AvatarPreviewProps = {
  document: AvatarDocument;
  size?: number;
  label?: string;
};

function AvatarPreview({
  document,
  size = AVATAR_SIZE,
  label = "Custom profile picture",
}: AvatarPreviewProps) {
  if (!Number.isFinite(size) || size <= 0) {
    throw new Error("Avatar preview size must be greater than zero.");
  }

  const scale = size / AVATAR_SIZE;

  return (
    <div
      role="img"
      aria-label={label}
      style={{
        position: "relative",
        width: size,
        height: size,
        flexShrink: 0,
        overflow: "hidden",
      }}
    >
      <div
        className="avatar-artboard"
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: AVATAR_SIZE,
          height: AVATAR_SIZE,
          boxSizing: "border-box",
          overflow: "hidden",
          backgroundColor: document.backgroundColor,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        {document.shapes.map((shape, index) => (
          <div
            key={shape.id}
            className={`avatar-shape-${index + 1}`}
            style={{
              ...getShapeStyle(shape),
              boxSizing: "border-box",
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AvatarPreview;