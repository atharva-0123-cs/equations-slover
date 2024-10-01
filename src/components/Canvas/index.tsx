import { useRef, useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { IoArrowUndo } from "react-icons/io5";
import { FiSave, FiSend, FiTrash, FiUpload } from "react-icons/fi";
import { FloatingIconButton } from "../FloatingIconButton";
import { SaveModal } from "../SaveModal";
import { UploadModal } from "../UploadModal";
import CanvasDraw from "react-canvas-draw";
import resizeImage from "../..//utils/resizeImage";

import "./styles.css";
import run from "../../api";

export function Canvas() {
  const canvasRef = useRef({} as CanvasDraw);
  const [isSMVisible, setIsSMVisible] = useState(false);
  const [isLMVisible, setIsLMVisible] = useState(false);
  const [brushRadius, setBrushRadius] = useState(4);
  const [brushColor, setBrushColor] = useState("#FFFFFF");
  const [clientWidth, setClientWidth] = useState(800);
  const [clientHeight, setClientHeight] = useState(600);

  useEffect(
    () => setClientWidth(document.body.clientWidth / 2),
    [document.body.clientWidth]
  );

  useEffect(
    () => setClientHeight(document.body.clientHeight / 2),
    [document.body.clientHeight]
  );

  const resizeObserver = new ResizeObserver((entries) => {
    for (let entry of entries) {
      if (entry.contentRect) {
        setClientWidth(document.body.clientWidth / 1.4);
        setClientHeight(document.body.clientHeight / 1.8);
      }
    }
  });

  resizeObserver.observe(document.body);

  async function submit() {
    //@ts-ignore
    const image64 = canvasRef.current.getDataURL("image/png", null);

    const resultImage = await resizeImage(
      await fetch(image64).then((res) => res.blob())
    );

    const form = new FormData();
    form.append("image", resultImage);

    console.log(resultImage);

    const prompt = `
  Analyze the image and provide a concise mathematical answer. Answer in at most 5 lines.
- Mention any relevant formulas or laws used (e.g., algebraic formulas, geometry theorems, 
  physics laws like Newton's laws, or chemical reaction balancing rules).
    `;

    try {
      const request: Promise<string | null> = run(
        prompt,
        resultImage
      );

      toast.promise(
        request,
        {
          loading: "Loading",
          success: (res) => <p>{`${res}`}</p>,
          error: (err) => `error : ${err.toString()}`,
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 5000,
            icon: "🔎",
          },
        }
      );
    } catch (error) {
      throw new Error("Somthing goes  Worng")
    }

  }

  function handleUpdateBrushSize(e: any) {
    const value = Number(e.target.value);

    if (value > 14) setBrushRadius(14);
    else if (value < 1) setBrushRadius(1);
    else setBrushRadius(value);
  }

  return (
    <main className="main">
      <div id="canvas-container">
        <span className="floating-left-controls">
          <FloatingIconButton
            icon={FiSave}
            tooltip="save"
            onClick={() => setIsSMVisible(true)}
            left
          // disabled
          />
          <FloatingIconButton
            icon={FiUpload}
            tooltip="upload"
            onClick={() => setIsLMVisible(true)}
            left
          // disabled
          />
        </span>
        <CanvasDraw
          ref={canvasRef}
          className="drawer"
          canvasWidth={clientWidth}
          canvasHeight={clientHeight}
          backgroundColor="#0F0F0F"
          brushColor={brushColor}
          brushRadius={brushRadius}
          hideGrid={true}
        />
        <span className="floating-right-controls">
          <FloatingIconButton
            icon={FiTrash}
            tooltip="erase"
            onClick={() => canvasRef.current.clear()}
          />
          <FloatingIconButton
            icon={IoArrowUndo}
            tooltip="undo"
            onClick={() => canvasRef.current.undo()}
          />
        </span>
      </div>
      <div className="floor-controls">
        <div className="brush-controls">
          <input
            type="color"
            value={brushColor}
            onChange={(e) => setBrushColor(e.target.value)}
          />
          <input
            type="number"
            min={1}
            max={14}
            value={brushRadius}
            onChange={handleUpdateBrushSize}
            color="#1b1b1b"
          />
        </div>
        <FloatingIconButton
          icon={FiSend}
          tooltip="send"
          className="floating-button send"
          onClick={submit}
        />
      </div>
      <SaveModal
        show={isSMVisible}
        setShow={setIsSMVisible}
        canvasRef={canvasRef}
      />
      <UploadModal
        show={isLMVisible}
        setShow={setIsLMVisible}
        canvasRef={canvasRef}
      />
    </main>
  );
}
