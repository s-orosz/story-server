import { useRef, useState } from "react";
import type { KeyboardEvent, PointerEvent } from "react";
import AvatarPreview from "./AvatarPreview";
import { generateAvatarCss, getShapeStyle } from "./generateCSS";
import { AVATAR_SIZE } from "./types";
import type {
  AvatarDocument,
  AvatarShape,
  AvatarShapeKind,
} from "./types";

type AvatarEditorProps = {
  document: AvatarDocument;
  onChange: (document: AvatarDocument) => void;
};

type DragState = {
    pointerId: number;
    startPointerX: number;
    startPointerY: number;
    shapes: {
      id: string;
      x: number;
      y: number;
    }[];
  };

type NumericField = "x" | "y" | "width" | "height" | "rotation";

function AvatarEditor({ document, onChange }: AvatarEditorProps) {
    const [selectedShapeIds, setSelectedShapeIds] = useState<string[]>([]);
    const [draggedLayerId, setDraggedLayerId] = useState<string | null>(null);
    
    const dragRef = useRef<DragState | null>(null);
    
    const selectedShapes = document.shapes.filter((shape) =>
      selectedShapeIds.includes(shape.id),
    );
    
    // Show individual property fields only for a single selection.
    const selectedShape =
      selectedShapes.length === 1 ? selectedShapes[0] : undefined;
    
    function selectShape(shapeId: string, additive: boolean) {
      setSelectedShapeIds((current) => {
        if (!additive) return [shapeId];
    
        return current.includes(shapeId)
          ? current.filter((id) => id !== shapeId)
          : [...current, shapeId];
      });
    }


  function updateShape(
    shapeId: string,
    changes: Partial<AvatarShape>,
  ) {
    onChange({
      ...document,
      shapes: document.shapes.map((shape) =>
        shape.id === shapeId ? { ...shape, ...changes } : shape,
      ),
    });
  }

  function addShape(kind: AvatarShapeKind) {
    const shape: AvatarShape = {
      id: crypto.randomUUID(),
      kind,
      x: 78,
      y: 78,
      width: 100,
      height: 100,
      rotation: 0,
      fill: "#6473c9",
    };

    onChange({
      ...document,
      shapes: [...document.shapes, shape],
    });

    setSelectedShapeIds([shape.id]);
  }

  function updateSelectedColor(fill: string) {
    onChange({
      ...document,
      shapes: document.shapes.map((shape) =>
        selectedShapeIds.includes(shape.id)
          ? { ...shape, fill }
          : shape,
      ),
    });
  }

  function deleteSelectedShape() {
    if (selectedShapeIds.length === 0) return;
  
    onChange({
      ...document,
      shapes: document.shapes.filter(
        (shape) => !selectedShapeIds.includes(shape.id),
      ),
    });
  
    setSelectedShapeIds([]);
  }
  
  function reorderLayers(sourceId: string, targetId: string) {
    if (sourceId === targetId) return;
  
    // Dragging a selected layer moves the whole selected group.
    // Dragging an unselected layer moves only that layer.
    const movingIds = new Set(
      selectedShapeIds.includes(sourceId)
        ? selectedShapeIds
        : [sourceId],
    );
  
    if (movingIds.has(targetId)) return;
  
    const sourceIndex = document.shapes.findIndex(
      (shape) => shape.id === sourceId,
    );
    const targetIndex = document.shapes.findIndex(
      (shape) => shape.id === targetId,
    );
  
    if (sourceIndex < 0 || targetIndex < 0) return;
  
    const movingShapes = document.shapes.filter((shape) =>
      movingIds.has(shape.id),
    );
  
    const remainingShapes = document.shapes.filter(
      (shape) => !movingIds.has(shape.id),
    );
  
    const targetPosition = remainingShapes.findIndex(
      (shape) => shape.id === targetId,
    );
  
    // Drop after the target when moving toward the front,
    // and before it when moving toward the back.
    const insertionIndex =
      sourceIndex < targetIndex ? targetPosition + 1 : targetPosition;
  
    remainingShapes.splice(insertionIndex, 0, ...movingShapes);
  
    onChange({ ...document, shapes: remainingShapes });
    setSelectedShapeIds(movingShapes.map((shape) => shape.id));
  }

  function updateNumber(field: NumericField, value: number) {
    if (!selectedShape || !Number.isFinite(value)) return;

    const nextValue =
      field === "width" || field === "height"
        ? Math.max(1, value)
        : value;

    updateShape(selectedShape.id, { [field]: nextValue });
  }

  function startDrag(
    event: PointerEvent<HTMLButtonElement>,
    shape: AvatarShape,
  ) {
    if (!event.isPrimary || event.button !== 0) return;
  
    event.preventDefault();

    event.currentTarget
      .closest<HTMLElement>(".avatar-editor")
      ?.focus({ preventScroll: true });
  
    const additive = event.ctrlKey || event.metaKey;
  
    // Modifier-click changes selection without starting a drag.
    if (additive) {
      selectShape(shape.id, true);
      return;
    }
  
    const movingIds = selectedShapeIds.includes(shape.id)
      ? selectedShapeIds
      : [shape.id];
  
    setSelectedShapeIds(movingIds);
  
    event.currentTarget.setPointerCapture(event.pointerId);
  
    dragRef.current = {
      pointerId: event.pointerId,
      startPointerX: event.clientX,
      startPointerY: event.clientY,
      shapes: document.shapes
        .filter((item) => movingIds.includes(item.id))
        .map((item) => ({
          id: item.id,
          x: item.x,
          y: item.y,
        })),
    };
  }
  
  function continueDrag(event: PointerEvent<HTMLButtonElement>) {
    const drag = dragRef.current;
  
    if (!drag || drag.pointerId !== event.pointerId) return;
  
    const deltaX = Math.round(event.clientX - drag.startPointerX);
    const deltaY = Math.round(event.clientY - drag.startPointerY);
  
    const startingPositions = new Map(
      drag.shapes.map((shape) => [shape.id, shape]),
    );
  
    onChange({
      ...document,
      shapes: document.shapes.map((shape) => {
        const start = startingPositions.get(shape.id);
  
        return start
          ? {
              ...shape,
              x: start.x + deltaX,
              y: start.y + deltaY,
            }
          : shape;
      }),
    });
  }

  function endDrag(event: PointerEvent<HTMLButtonElement>) {
    if (dragRef.current?.pointerId === event.pointerId) {
      dragRef.current = null;
    }
  }

  function handleEditorKeyDown(event: KeyboardEvent<HTMLElement>) {
    const target = event.target;
  
    // Keep normal typing and input behavior intact.
    if (
      target instanceof HTMLElement &&
      target.closest(
        "input, textarea, select, [contenteditable]:not([contenteditable='false'])",
      )
    ) {
      return;
    }
  
    // Preserve browser and operating-system shortcuts.
    if (event.ctrlKey || event.metaKey || event.altKey) {
      return;
    }
  
    if (selectedShapes.length === 0) return;

    if (event.key === "Backspace" || event.key === "Delete") {
        event.preventDefault();
      
        // Keep focus in the editor when a selected layer is removed.
        event.currentTarget.focus({ preventScroll: true });
      
        deleteSelectedShape();
        return;
      }
  
    let deltaX = 0;
    let deltaY = 0;
  
    const distance = event.shiftKey ? 10 : 1;
  
    switch (event.key.toLowerCase()) {
      case "arrowleft":
      case "a":
        deltaX = -distance;
        break;
  
      case "arrowright":
      case "d":
        deltaX = distance;
        break;
  
      case "arrowup":
      case "w":
        deltaY = -distance;
        break;
  
      case "arrowdown":
      case "s":
        deltaY = distance;
        break;
  
      default:
        return;
    }
  
    // Prevent arrow keys from scrolling the page.
    event.preventDefault();

    // Keep movement focused on the editor rather than a control.
    event.currentTarget.focus({ preventScroll: true });
  
    onChange({
      ...document,
      shapes: document.shapes.map((shape) =>
        selectedShapeIds.includes(shape.id)
          ? {
              ...shape,
              x: shape.x + deltaX,
              y: shape.y + deltaY,
            }
          : shape,
      ),
    });
  }

  const canMoveBackward = document.shapes.some(
    (shape, index) =>
      selectedShapeIds.includes(shape.id) &&
      index > 0 &&
      !selectedShapeIds.includes(document.shapes[index - 1].id),
  );
  
  const canMoveForward = document.shapes.some(
    (shape, index) =>
      selectedShapeIds.includes(shape.id) &&
      index < document.shapes.length - 1 &&
      !selectedShapeIds.includes(document.shapes[index + 1].id),
  );

  return (
    <section
      className="avatar-editor"
      aria-labelledby="avatar-editor-title"
      tabIndex={0}
      onKeyDown={handleEditorKeyDown}
    >
      <header>
        <h2 id="avatar-editor-title">Create your avatar</h2>
        <p>
          Add a shape, then select it to edit. Drag to move, or use
          the position fields for precise control.
        </p>
      </header>

      <div className="avatar-editor-layout">
        <div className="avatar-canvas-panel">
          <div className="avatar-toolbar">
            <button
                type="button"
                aria-label="add rectangle"
                onClick={(event) => {
                    addShape("rectangle");

                    event.currentTarget
                    .closest<HTMLElement>(".avatar-editor")
                    ?.focus({ preventScroll: true });
                }}
            >
                Add rectangle
            </button>
            <button
                type="button"
                onClick={(event) => {
                    addShape("ellipse");

                    event.currentTarget
                    .closest<HTMLElement>(".avatar-editor")
                    ?.focus({ preventScroll: true });
                }}
            >
                Add ellipse
            </button>
          </div>

          <div
            className="avatar-editing-canvas"
            style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
            onPointerDown={(event) => {
                const target = event.target;
            
                if (
                  target instanceof Element &&
                  !target.closest(".avatar-shape-target")
                ) {
                  setSelectedShapeIds([]);
                }
              }}
          >
            <AvatarPreview
              document={document}
              label="Preview of your custom avatar"
            />

            <div className="avatar-interaction-layer">
              {document.shapes.map((shape, index) => (
                <button
                  key={shape.id}
                  type="button"
                  tabIndex={-1}
                  className="avatar-shape-target"
                  aria-label={`Select ${shape.kind}, layer ${index + 1}`}
                  aria-pressed={selectedShapeIds.includes(shape.id)}
                  style={{
                    ...getShapeStyle(shape),
                    backgroundColor: "transparent",
                    outline: selectedShapeIds.includes(shape.id)
                      ? "2px dashed #111827"
                      : undefined,
                    outlineOffset: "-2px",
                  }}
                  onClick={(event) => {
                    // Keyboard-generated clicks don't run the pointer handler.
                    event.currentTarget
                    .closest<HTMLElement>(".avatar-editor")
                    ?.focus({ preventScroll: true });

                    if (event.detail === 0) {
                      selectShape(shape.id, event.ctrlKey || event.metaKey);
                    }
                  }}
                  onPointerDown={(event) => startDrag(event, shape)}
                  onPointerMove={continueDrag}
                  onPointerUp={endDrag}
                  onPointerCancel={endDrag}
                  onLostPointerCapture={endDrag}
                />
              ))}
            </div>
          </div>

          <label className="avatar-field">
            Background color
            <input
              type="color"
              value={document.backgroundColor}
              onChange={(event) =>
                onChange({
                  ...document,
                  backgroundColor: event.target.value,
                })
              }
            />
          </label>
        </div>

        <div className="avatar-controls">
          <h3>Layers</h3>
          <p>Later layers appear in front of earlier layers.</p>

          {document.shapes.length === 0 ? (
            <p>No shapes yet. Add one to begin.</p>
          ) : (
            <ul className="avatar-layer-list">
                {document.shapes.map((shape, index) => (
                    <li
                    key={shape.id}
                    className={
                        draggedLayerId && draggedLayerId !== shape.id
                        ? "avatar-layer-drop-target"
                        : undefined
                    }
                    onDragOver={(event) => {
                        if (!draggedLayerId) return;

                        event.preventDefault();
                        event.dataTransfer.dropEffect = "move";
                    }}
                    onDrop={(event) => {
                        event.preventDefault();

                        if (draggedLayerId) {
                        reorderLayers(draggedLayerId, shape.id);
                        }

                        setDraggedLayerId(null);
                    }}
                    >
                    <button
                        type="button"
                        className="avatar-layer-select"
                        draggable
                        aria-pressed={selectedShapeIds.includes(shape.id)}
                        onClick={(event) =>
                        selectShape(shape.id, event.ctrlKey || event.metaKey)
                        }
                        onDragStart={(event) => {
                        setDraggedLayerId(shape.id);
                        event.dataTransfer.effectAllowed = "move";
                        event.dataTransfer.setData("text/plain", shape.id);
                        }}
                        onDragEnd={() => setDraggedLayerId(null)}
                    >
                        Layer {index + 1}: {shape.kind}
                    </button>
                    </li>
                ))}
            </ul>
          )}

          <p className="avatar-selection-help">
            Ctrl-click or Command-click to toggle layers. Drag a layer onto
            another to reorder it.
          </p>

          <div className="avatar-toolbar">
            <button
                type="button"
                disabled={document.shapes.length === 0}
                onClick={() =>
                setSelectedShapeIds(document.shapes.map((shape) => shape.id))
                }
            >
                Select all
            </button>

            <button
                type="button"
                disabled={selectedShapeIds.length === 0}
                onClick={() => setSelectedShapeIds([])}
            >
                Deselect all
            </button>
            <button
                type="button"
                disabled={selectedShapes.length === 0}
                onClick={deleteSelectedShape}
                >
                Delete selected
            </button>
          </div>

          {selectedShape ? (
            <fieldset className="avatar-properties">
            <legend>Selected shape</legend>
          
            <div className="avatar-property-grid">
              {(
                [
                  ["x", "Horizontal position"],
                  ["y", "Vertical position"],
                  ["width", "Width"],
                  ["height", "Height"],
                  ["rotation", "Rotation (degrees)"],
                ] as const
              ).map(([field, label]) => (
                <label className="avatar-field" key={field}>
                  {label}
                  <input
                    type="number"
                    step="1"
                    min={
                      field === "width" || field === "height"
                        ? 1
                        : undefined
                    }
                    value={selectedShape[field]}
                    onChange={(event) =>
                      updateNumber(field, event.target.valueAsNumber)
                    }
                  />
                </label>
              ))}
            </div>
            <label className="avatar-field avatar-color-field">
                Selected color
                <input
                    type="color"
                    value={selectedShapes[0].fill}
                    onChange={(event) =>
                    updateSelectedColor(event.target.value)
                    }
                />
            </label>
          </fieldset>
          ) : (
            <p>
              {selectedShapes.length > 1
                ? `${selectedShapes.length} shapes selected. Drag a selected shape to move the group. Select one shape to edit its properties.`
                : "No shapes selected. Select a shape to edit its properties."}
              <div className="avatar-property-actions avatar-selection-actions">
                {selectedShapes.length > 0 && (
                    <label className="avatar-field avatar-color-field">
                    Selected color
                    <input
                        type="color"
                        value={selectedShapes[0].fill}
                        onChange={(event) =>
                        updateSelectedColor(event.target.value)
                        }
                    />
                    </label>
                )}

                
              </div>

                {selectedShapes.length > 1 &&
                selectedShapes.some(
                    (shape) => shape.fill !== selectedShapes[0].fill,
                ) && (
                    <p className="avatar-selection-help">
                    Selected shapes have different colors. The picker shows the
                    first selected layer’s color; choosing a color applies it to
                    all selected shapes.
                    </p>
                )}
            </p>
          )}
        </div>
      </div>

      <details className="avatar-css-panel">
        <summary>Generated CSS — read-only</summary>
        <label className="avatar-field">
          Stylesheet for the current artwork
          <textarea
            readOnly
            spellCheck={false}
            value={generateAvatarCss(document)}
          />
        </label>
      </details>
    </section>
  );
}

export default AvatarEditor;