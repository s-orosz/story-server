import type { CSSProperties } from "react";
import { AVATAR_SIZE } from "./types";
import type { AvatarDocument, AvatarShape } from "./types";

function validateColor(color: string): void {
  // Initially support #RGB and #RRGGBB colors only.
  const hexColorPattern = /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

  if (!hexColorPattern.test(color)) {
    throw new Error(
      `Invalid color "${color}". Use a hexadecimal color such as #6473c9.`,
    );
  }
}

function validateShape(shape: AvatarShape): void {
  const numericValues = [
    shape.x,
    shape.y,
    shape.width,
    shape.height,
    shape.rotation,
  ];

  if (!numericValues.every((value) => Number.isFinite(value))) {
    throw new Error("Shape position, size, and rotation must be finite numbers.");
  }

  if (shape.width <= 0 || shape.height <= 0) {
    throw new Error("Shape width and height must be greater than zero.");
  }

  if (shape.kind !== "rectangle" && shape.kind !== "ellipse") {
    throw new Error("Unsupported shape type.");
  }

  validateColor(shape.fill);
}

function getShapeDeclarations(shape: AvatarShape) {
  validateShape(shape);

  return {
    position: "absolute" as const,
    left: `${shape.x}px`,
    top: `${shape.y}px`,
    width: `${shape.width}px`,
    height: `${shape.height}px`,
    backgroundColor: shape.fill,
    borderRadius: shape.kind === "ellipse" ? "50%" : "0",
    transform: `rotate(${shape.rotation}deg)`,
    transformOrigin: "center",
  };
}

export function getShapeStyle(shape: AvatarShape): CSSProperties {
  return getShapeDeclarations(shape);
}

export function generateAvatarCss(document: AvatarDocument): string {
  validateColor(document.backgroundColor);

  const artboardCss = `.avatar-artboard {
  position: relative;
  width: ${AVATAR_SIZE}px;
  height: ${AVATAR_SIZE}px;
  overflow: hidden;
  background-color: ${document.backgroundColor};
}

.avatar-artboard,
.avatar-artboard * {
  box-sizing: border-box;
}`;

  const shapeCss = document.shapes.map((shape, index) => {
    const styles = getShapeDeclarations(shape);

    return `.avatar-artboard > .avatar-shape-${index + 1} {
  position: ${styles.position};
  left: ${styles.left};
  top: ${styles.top};
  width: ${styles.width};
  height: ${styles.height};
  background-color: ${styles.backgroundColor};
  border-radius: ${styles.borderRadius};
  transform: ${styles.transform};
  transform-origin: ${styles.transformOrigin};
}`;
  });

  return [artboardCss, ...shapeCss].join("\n\n");
}