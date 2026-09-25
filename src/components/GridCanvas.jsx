import React, { useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Eye, EyeOff, Layers, Crosshair } from 'lucide-react';

export default function GridCanvas({
  points = [],
  summary = {},
  algorithm = '',
  hoveredPoint = null,
  onHoverPoint = () => {},
  centerPoint = null,
  startPoint = null,
  endPoint = null,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  // View state: zoom scale (pixels per grid unit) and center offset in world coordinates
  const [scale, setScale] = useState(24); // pixels per grid cell
  const [offset, setOffset] = useState({ x: 0, y: 0 }); // world coordinate at canvas center
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showIdealShape, setShowIdealShape] = useState(true);
  const [showMirrored, setShowMirrored] = useState(true);
  const [showPixelCoords, setShowPixelCoords] = useState(true);
  const [canvasTooltip, setCanvasTooltip] = useState(null);

  // Filter points based on showMirrored toggle
  const visiblePoints = useMemo(() => {
    if (showMirrored) return points;
    return points.filter((p) => p.isPrimary);
  }, [points, showMirrored]);

  // Compute bounding box and auto-fit view when points change
  const autoFit = useCallback(() => {
    if (!containerRef.current || points.length === 0) return;

    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    points.forEach((p) => {
      minX = Math.min(minX, p.x);
      maxX = Math.max(maxX, p.x);
      minY = Math.min(minY, p.y);
      maxY = Math.max(maxY, p.y);
    });

    if (centerPoint) {
      minX = Math.min(minX, centerPoint.x);
      maxX = Math.max(maxX, centerPoint.x);
      minY = Math.min(minY, centerPoint.y);
      maxY = Math.max(maxY, centerPoint.y);
    }

    // Always include origin (0,0) for context
    minX = Math.min(minX, 0);
    maxX = Math.max(maxX, 0);
    minY = Math.min(minY, 0);
    maxY = Math.max(maxY, 0);

    const pad = 3;
    minX -= pad;
    maxX += pad;
    minY -= pad;
    maxY += pad;

    const spanX = Math.max(maxX - minX, 6);
    const spanY = Math.max(maxY - minY, 6);

    const { clientWidth, clientHeight } = containerRef.current;
    const fitScaleX = clientWidth / spanX;
    const fitScaleY = clientHeight / spanY;
    const newScale = Math.max(12, Math.min(48, Math.floor(Math.min(fitScaleX, fitScaleY))));

    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    setScale(newScale);
    setOffset({ x: centerX, y: centerY });
  }, [points, centerPoint]);

  // Trigger auto-fit when algorithm or points change drastically
  useEffect(() => {
    autoFit();
  }, [algorithm, points.length, centerPoint?.x, centerPoint?.y]);

  // Draw function
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !containerRef.current) return;

    const dpr = window.devicePixelRatio || 1;
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    ctx.resetTransform();
    ctx.scale(dpr, dpr);

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, width, height);

    // Helpers for coordinate transformation
    // World (x, y) with standard math axes (Y goes UP) to Canvas (cx, cy)
    const originCanvasX = width / 2 - offset.x * scale;
    const originCanvasY = height / 2 + offset.y * scale;

    const toCanvasX = (worldX) => originCanvasX + worldX * scale;
    const toCanvasY = (worldY) => originCanvasY - worldY * scale;

    // Determine grid bounds visible on screen
    const minGridX = Math.floor((0 - originCanvasX) / scale) - 1;
    const maxGridX = Math.ceil((width - originCanvasX) / scale) + 1;
    const minGridY = Math.floor((originCanvasY - height) / scale) - 1;
    const maxGridY = Math.ceil(originCanvasY / scale) + 1;

    // 1. Grid Lines
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#1e293b'; // slate-800
    ctx.beginPath();
    for (let x = minGridX; x <= maxGridX; x++) {
      const cx = Math.round(toCanvasX(x)) + 0.5;
      ctx.moveTo(cx, 0);
      ctx.lineTo(cx, height);
    }
    for (let y = minGridY; y <= maxGridY; y++) {
      const cy = Math.round(toCanvasY(y)) + 0.5;
      ctx.moveTo(0, cy);
      ctx.lineTo(width, cy);
    }
    ctx.stroke();

    // 2. Axes X and Y
    const axisY = Math.round(originCanvasY) + 0.5;
    const axisX = Math.round(originCanvasX) + 0.5;

    ctx.lineWidth = 2;
    ctx.strokeStyle = '#475569'; // slate-600

    // X Axis
    if (axisY >= 0 && axisY <= height) {
      ctx.beginPath();
      ctx.moveTo(0, axisY);
      ctx.lineTo(width, axisY);
      ctx.stroke();
    }

    // Y Axis
    if (axisX >= 0 && axisX <= width) {
      ctx.beginPath();
      ctx.moveTo(axisX, 0);
      ctx.lineTo(axisX, height);
      ctx.stroke();
    }

    // Axis Tick Labels
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#64748b'; // slate-500
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    const tickInterval = scale < 18 ? 5 : scale < 32 ? 2 : 1;

    for (let x = minGridX; x <= maxGridX; x++) {
      if (x % tickInterval === 0 && x !== 0) {
        const cx = toCanvasX(x);
        const cy = Math.max(14, Math.min(height - 18, originCanvasY + 4));
        ctx.fillText(x.toString(), cx, cy);
      }
    }

    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    for (let y = minGridY; y <= maxGridY; y++) {
      if (y % tickInterval === 0 && y !== 0) {
        const cy = toCanvasY(y);
        const cx = Math.max(24, Math.min(width - 6, originCanvasX - 6));
        ctx.fillText(y.toString(), cx, cy);
      }
    }

    // Origin (0,0) label
    ctx.textAlign = 'right';
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText('0', originCanvasX - 4, originCanvasY + 4);

    // 3. Ideal Mathematical Shape (Continous line/circle/ellipse for visual reference)
    if (showIdealShape) {
      ctx.save();
      ctx.setLineDash([4, 4]);
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)'; // Sky blue translucent

      if (algorithm === 'DDA' || algorithm === 'Bresenham') {
        const pStart = startPoint || (points.length > 0 ? points[0] : null);
        const pEnd = endPoint || (points.length > 0 ? points[points.length - 1] : null);
        if (pStart && pEnd) {
          ctx.beginPath();
          ctx.moveTo(toCanvasX(pStart.x + 0.5), toCanvasY(pStart.y + 0.5));
          ctx.lineTo(toCanvasX(pEnd.x + 0.5), toCanvasY(pEnd.y + 0.5));
          ctx.stroke();
        }
      } else if (algorithm === 'MidpointCircle' && summary.r) {
        const cX = summary.xc || 0;
        const cY = summary.yc || 0;
        const radius = summary.r;
        ctx.beginPath();
        ctx.arc(toCanvasX(cX + 0.5), toCanvasY(cY + 0.5), radius * scale, 0, Math.PI * 2);
        ctx.stroke();
      } else if (algorithm === 'MidpointEllipse' && summary.rx && summary.ry) {
        const cX = summary.xc || 0;
        const cY = summary.yc || 0;
        ctx.beginPath();
        ctx.ellipse(
          toCanvasX(cX + 0.5),
          toCanvasY(cY + 0.5),
          summary.rx * scale,
          summary.ry * scale,
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
      }
      ctx.restore();
    }

    // 4. Plotted Pixels
    // Each pixel at integer (px, py) covers the unit cell [px, px+1] x [py, py+1]
    visiblePoints.forEach((pt) => {
      const isHovered =
        hoveredPoint &&
        Math.round(hoveredPoint.x) === Math.round(pt.x) &&
        Math.round(hoveredPoint.y) === Math.round(pt.y);

      // Pixel box coordinates
      const boxLeft = toCanvasX(pt.x);
      const boxTop = toCanvasY(pt.y + 1);
      const boxSize = scale;

      // Color scheme:
      // Primary calculation point: vibrant cyan-400 / teal
      // Mirrored point: soft purple / indigo
      // Hovered point: bright glowing amber-400
      let fillColor = pt.isPrimary ? 'rgba(6, 182, 212, 0.75)' : 'rgba(168, 85, 247, 0.45)';
      let borderColor = pt.isPrimary ? '#22d3ee' : '#c084fc';

      if (isHovered) {
        fillColor = 'rgba(251, 191, 36, 0.9)'; // amber-400
        borderColor = '#ffffff';
      }

      ctx.fillStyle = fillColor;
      ctx.fillRect(boxLeft + 1, boxTop + 1, boxSize - 2, boxSize - 2);

      ctx.lineWidth = isHovered ? 2 : 1;
      ctx.strokeStyle = borderColor;
      ctx.strokeRect(boxLeft + 1, boxTop + 1, boxSize - 2, boxSize - 2);

      // Optional text inside pixel cell when zoom is sufficient
      if (showPixelCoords && scale >= 26) {
        ctx.font = `${Math.max(8, Math.min(11, Math.floor(scale / 3)))}px "JetBrains Mono", monospace`;
        ctx.fillStyle = isHovered ? '#0f172a' : '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = `${pt.x},${pt.y}`;
        ctx.fillText(label, boxLeft + boxSize / 2, boxTop + boxSize / 2);
      }
    });

    // 5. Center Point Marker (for Circle & Ellipse)
    if (centerPoint) {
      const cx = toCanvasX(centerPoint.x + 0.5);
      const cy = toCanvasY(centerPoint.y + 0.5);

      ctx.save();
      ctx.fillStyle = '#f43f5e'; // rose-500
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#ffe4e6';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.font = '10px "JetBrains Mono", monospace';
      ctx.fillStyle = '#fda4af';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'bottom';
      ctx.fillText(` Pusat (${centerPoint.x},${centerPoint.y})`, cx + 6, cy - 4);
      ctx.restore();
    }

    // 6. Highlight hovered point with radial pulse ring
    if (hoveredPoint) {
      const hx = toCanvasX(hoveredPoint.x + 0.5);
      const hy = toCanvasY(hoveredPoint.y + 0.5);

      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(hx, hy, scale * 0.7, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }, [
    scale,
    offset,
    visiblePoints,
    showIdealShape,
    showPixelCoords,
    hoveredPoint,
    centerPoint,
    startPoint,
    endPoint,
    algorithm,
    summary,
  ]);

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
    const newScale = Math.max(8, Math.min(80, scale * zoomFactor));
    setScale(newScale);
  };

  // Drag to pan
  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Left click only
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!canvasRef.current || !containerRef.current) return;

    if (isDragging) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dy = (e.clientY - dragStart.y) / scale;
      setOffset((prev) => ({ x: prev.x - dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
      return;
    }

    // Detect hovered pixel
    const rect = canvasRef.current.getBoundingClientRect();
    const mouseCanvasX = e.clientX - rect.left;
    const mouseCanvasY = e.clientY - rect.top;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    const originCanvasX = width / 2 - offset.x * scale;
    const originCanvasY = height / 2 + offset.y * scale;

    const worldX = Math.floor((mouseCanvasX - originCanvasX) / scale);
    const worldY = Math.floor((originCanvasY - mouseCanvasY) / scale);

    const hit = visiblePoints.find((p) => p.x === worldX && p.y === worldY);

    if (hit) {
      onHoverPoint(hit);
      setCanvasTooltip({
        x: mouseCanvasX,
        y: mouseCanvasY,
        coord: `(${hit.x}, ${hit.y})`,
        isPrimary: hit.isPrimary,
        k: hit.k !== undefined ? hit.k : hit.kLabel,
      });
    } else {
      onHoverPoint(null);
      setCanvasTooltip(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    onHoverPoint(null);
    setCanvasTooltip(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 rounded-2xl border border-slate-800 shadow-xl overflow-hidden backdrop-blur-md">
      {/* Canvas Header / Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-950/60 border-b border-slate-800 gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-400 animate-pulse"></span>
          <h3 className="font-semibold text-sm text-slate-200 tracking-wide flex items-center gap-1.5">
            <Crosshair className="w-4 h-4 text-cyan-400" />
            Grid Visualizer
          </h3>
          <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700 font-mono">
            {visiblePoints.length} pixel
          </span>
        </div>

        {/* Legend */}
        <div className="hidden sm:flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-sm bg-cyan-500/80 border border-cyan-400"></span>
            <span className="text-slate-300">Hasil Kalkulasi Utama</span>
          </div>
          {(algorithm === 'MidpointCircle' || algorithm === 'MidpointEllipse') && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-purple-500/60 border border-purple-400"></span>
              <span className="text-slate-300">Pencerminan Simetri</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {(algorithm === 'MidpointCircle' || algorithm === 'MidpointEllipse') && (
            <button
              onClick={() => setShowMirrored(!showMirrored)}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                showMirrored
                  ? 'bg-purple-900/30 border-purple-500/40 text-purple-300 hover:bg-purple-900/50'
                  : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
              }`}
              title="Tampilkan / Sembunyikan Titik Pencerminan Simetri"
            >
              <Layers className="w-3.5 h-3.5" />
              <span className="hidden md:inline">Simetri</span>
            </button>
          )}

          <button
            onClick={() => setShowIdealShape(!showIdealShape)}
            className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
              showIdealShape
                ? 'bg-sky-900/30 border-sky-500/40 text-sky-300 hover:bg-sky-900/50'
                : 'bg-slate-800/80 border-slate-700 text-slate-400 hover:bg-slate-700'
            }`}
            title="Tampilkan Garis/Kurva Kontinu Matematis"
          >
            {showIdealShape ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">Kontinu</span>
          </button>

          <button
            onClick={() => setShowPixelCoords(!showPixelCoords)}
            className={`px-2 py-1 rounded-lg border text-xs font-mono transition-colors ${
              showPixelCoords
                ? 'bg-slate-800 border-slate-600 text-cyan-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
            title="Toggle label koordinat pada pixel"
          >
            (x,y)
          </button>

          <div className="h-4 w-px bg-slate-800 mx-1"></div>

          <button
            onClick={() => setScale((s) => Math.min(80, s * 1.25))}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Perbesar Grid (Zoom In)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setScale((s) => Math.max(8, s / 1.25))}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Perkecil Grid (Zoom Out)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={autoFit}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
            title="Reset Posisi & Auto-Fit Grid"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div
        ref={containerRef}
        className="relative flex-1 w-full min-h-[360px] md:min-h-[440px] cursor-grab active:cursor-grabbing select-none"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseLeave}
      >
        <canvas ref={canvasRef} className="absolute inset-0 block w-full h-full" />

        {/* Hover Tooltip */}
        {canvasTooltip && (
          <div
            className="absolute pointer-events-none z-20 px-2.5 py-1.5 rounded-lg bg-slate-950/90 border border-cyan-500/50 shadow-lg text-xs font-mono text-cyan-200 transform -translate-x-1/2 -translate-y-full mb-2 backdrop-blur-sm"
            style={{
              left: `${canvasTooltip.x}px`,
              top: `${canvasTooltip.y}px`,
            }}
          >
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>{canvasTooltip.coord}</span>
              {canvasTooltip.k !== undefined && (
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                  k = {canvasTooltip.k}
                </span>
              )}
            </div>
            <div className="text-[10px] text-slate-400">
              {canvasTooltip.isPrimary ? 'Titik Utama (Tabel)' : 'Titik Hasil Simetri'}
            </div>
          </div>
        )}

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-2.5 left-3 text-[11px] text-slate-500 font-mono pointer-events-none bg-slate-950/40 px-2 py-1 rounded backdrop-blur-xs">
          Scroll mouse: Zoom | Drag: Geser grid
        </div>
      </div>
    </div>
  );
}
