export const AVATAR_SIZE = 256;

export type AvatarShapeKind = "rectangle" | "ellipse";

export type AvatarShape = {
  id: string;
  kind: AvatarShapeKind;

  x: number;
  y: number;

  width: number;
  height: number;

  rotation: number;
  fill: string;
};

export type AvatarDocument = {
  version: 1;
  backgroundColor: string;
  shapes: AvatarShape[];
};

export function createEmptyAvatar(): AvatarDocument {
  return {
    version: 1,
    backgroundColor: "#e6e9f2",
    shapes: [],
  };
}