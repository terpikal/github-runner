import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Move, Maximize2, RotateCcw, Lock, Unlock, Trash2, Type, Image as ImageIcon } from 'lucide-react';

const HANDLE_SIZE = 8;

const DraggableElement = ({ element, isSelected, onSelect, onUpdate, canvasRect, scale }) => {
    const elRef = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState(null);
    const dragStart = useRef({ x: 0, y: 0, elX: 0, elY: 0, elW: 0, elH: 0 });

    const handleMouseDown = (e) => {
        e.stopPropagation();
        onSelect(element.id);
        if (element.locked) return;
        setIsDragging(true);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            elX: element.x,
            elY: element.y,
            elW: element.width,
            elH: element.height,
        };
    };

    const handleResizeStart = (e, handle) => {
        e.stopPropagation();
        e.preventDefault();
        if (element.locked) return;
        onSelect(element.id);
        setIsResizing(true);
        setResizeHandle(handle);
        dragStart.current = {
            x: e.clientX,
            y: e.clientY,
            elX: element.x,
            elY: element.y,
            elW: element.width,
            elH: element.height,
        };
    };

    const handleTouchStart = (e) => {
        e.stopPropagation();
        onSelect(element.id);
        if (element.locked) return;
        const touch = e.touches[0];
        setIsDragging(true);
        dragStart.current = {
            x: touch.clientX,
            y: touch.clientY,
            elX: element.x,
            elY: element.y,
            elW: element.width,
            elH: element.height,
        };
    };

    useEffect(() => {
        if (!isDragging && !isResizing) return;

        const handleMove = (clientX, clientY) => {
            const dx = (clientX - dragStart.current.x) / scale;
            const dy = (clientY - dragStart.current.y) / scale;

            if (isDragging) {
                onUpdate(element.id, {
                    x: Math.round(dragStart.current.elX + dx),
                    y: Math.round(dragStart.current.elY + dy),
                });
            }

            if (isResizing) {
                let newX = dragStart.current.elX;
                let newY = dragStart.current.elY;
                let newW = dragStart.current.elW;
                let newH = dragStart.current.elH;

                if (resizeHandle.includes('r')) newW = Math.max(30, dragStart.current.elW + dx);
                if (resizeHandle.includes('l')) {
                    newW = Math.max(30, dragStart.current.elW - dx);
                    newX = dragStart.current.elX + dx;
                }
                if (resizeHandle.includes('b')) newH = Math.max(20, dragStart.current.elH + dy);
                if (resizeHandle.includes('t')) {
                    newH = Math.max(20, dragStart.current.elH - dy);
                    newY = dragStart.current.elY + dy;
                }

                onUpdate(element.id, {
                    x: Math.round(newX),
                    y: Math.round(newY),
                    width: Math.round(newW),
                    height: Math.round(newH),
                });
            }
        };

        const onMouseMove = (e) => handleMove(e.clientX, e.clientY);
        const onTouchMove = (e) => {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        };

        const onEnd = () => {
            setIsDragging(false);
            setIsResizing(false);
            setResizeHandle(null);
        };

        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onEnd);
        window.addEventListener('touchmove', onTouchMove, { passive: false });
        window.addEventListener('touchend', onEnd);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onEnd);
            window.removeEventListener('touchmove', onTouchMove);
            window.removeEventListener('touchend', onEnd);
        };
    }, [isDragging, isResizing, resizeHandle, element.id, onUpdate, scale]);

    const handles = ['tl', 'tr', 'bl', 'br', 't', 'r', 'b', 'l'];
    const handlePositions = {
        tl: { top: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: 'nwse-resize' },
        tr: { top: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: 'nesw-resize' },
        bl: { bottom: -HANDLE_SIZE / 2, left: -HANDLE_SIZE / 2, cursor: 'nesw-resize' },
        br: { bottom: -HANDLE_SIZE / 2, right: -HANDLE_SIZE / 2, cursor: 'nwse-resize' },
        t: { top: -HANDLE_SIZE / 2, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
        b: { bottom: -HANDLE_SIZE / 2, left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize' },
        l: { top: '50%', left: -HANDLE_SIZE / 2, transform: 'translateY(-50%)', cursor: 'ew-resize' },
        r: { top: '50%', right: -HANDLE_SIZE / 2, transform: 'translateY(-50%)', cursor: 'ew-resize' },
    };

    const renderContent = () => {
        if (element.type === 'text') {
            return (
                <div
                    className="w-full h-full flex items-center overflow-hidden whitespace-pre-wrap break-words"
                    style={{
                        fontSize: element.fontSize || 16,
                        fontWeight: element.fontWeight || 'normal',
                        color: element.color || '#fff',
                        fontFamily: element.fontFamily || 'inherit',
                        textAlign: element.textAlign || 'center',
                        justifyContent: element.textAlign === 'left' ? 'flex-start' : element.textAlign === 'right' ? 'flex-end' : 'center',
                        letterSpacing: element.letterSpacing || 'normal',
                        lineHeight: element.lineHeight || 1.3,
                        padding: '4px',
                    }}
                >
                    {element.text}
                </div>
            );
        }
        if (element.type === 'image') {
            return (
                <img
                    src={element.src}
                    alt=""
                    className="w-full h-full object-cover rounded"
                    draggable={false}
                />
            );
        }
        if (element.type === 'shape') {
            return (
                <div
                    className="w-full h-full"
                    style={{
                        backgroundColor: element.fill || 'rgba(255,255,255,0.2)',
                        borderRadius: element.borderRadius || 0,
                        border: element.border || 'none',
                    }}
                />
            );
        }
        if (element.type === 'button') {
            return (
                <div
                    className="w-full h-full flex items-center justify-center font-bold"
                    style={{
                        backgroundColor: element.bgColor || '#fff',
                        color: element.textColor || '#000',
                        borderRadius: element.borderRadius || 9999,
                        fontSize: element.fontSize || 12,
                        padding: '4px 8px',
                    }}
                >
                    {element.text}
                </div>
            );
        }
        return null;
    };

    return (
        <div
            ref={elRef}
            className={`absolute group ${element.locked ? 'cursor-default' : 'cursor-move'}`}
            style={{
                left: element.x,
                top: element.y,
                width: element.width,
                height: element.height,
                zIndex: element.zIndex || 1,
                outline: isSelected ? '2px solid #13c8ec' : 'none',
                outlineOffset: 2,
            }}
            onMouseDown={handleMouseDown}
            onTouchStart={handleTouchStart}
        >
            {renderContent()}

            {/* Resize handles */}
            {isSelected && !element.locked && handles.map((h) => (
                <div
                    key={h}
                    className="absolute bg-white border-2 rounded-sm"
                    style={{
                        width: HANDLE_SIZE,
                        height: HANDLE_SIZE,
                        borderColor: '#13c8ec',
                        ...handlePositions[h],
                        zIndex: 50,
                    }}
                    onMouseDown={(e) => handleResizeStart(e, h)}
                />
            ))}
        </div>
    );
};


const CanvasEditor = ({ post, brand, slideOverride = 0 }) => {
    const canvasRef = useRef(null);
    const [selectedId, setSelectedId] = useState(null);
    const [elements, setElements] = useState([]);
    const [canvasSize] = useState({ width: 400, height: 400 });
    const [scale, setScale] = useState(1);

    // Initialize elements from post data
    useEffect(() => {
        const isCarousel = post.type === 'carousel';
        const slides = isCarousel ? post.slides : [post];
        const currentData = slides[slideOverride] || post;

        const initialElements = [
            {
                id: 'badge',
                type: 'shape',
                x: 12,
                y: 12,
                width: 120,
                height: 28,
                fill: 'rgba(255,255,255,0.2)',
                borderRadius: 4,
                border: '1px solid rgba(255,255,255,0.3)',
                zIndex: 5,
                locked: false,
            },
            {
                id: 'badge-text',
                type: 'text',
                x: 12,
                y: 12,
                width: 120,
                height: 28,
                text: brand.name.toUpperCase(),
                fontSize: 9,
                fontWeight: 900,
                color: '#ffffff',
                letterSpacing: '0.2em',
                textAlign: 'center',
                zIndex: 6,
                locked: false,
            },
            {
                id: 'headline',
                type: 'text',
                x: 32,
                y: 140,
                width: 336,
                height: 80,
                text: currentData.headline || 'Headline',
                fontSize: 28,
                fontWeight: 900,
                color: brand.secondaryColor || '#ffffff',
                textAlign: 'center',
                lineHeight: 1.1,
                zIndex: 10,
                locked: false,
            },
            {
                id: 'body',
                type: 'text',
                x: 48,
                y: 225,
                width: 304,
                height: 50,
                text: currentData.body || 'Sub-headline',
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                textAlign: 'center',
                zIndex: 10,
                locked: false,
            },
            {
                id: 'cta',
                type: 'button',
                x: 120,
                y: 340,
                width: 160,
                height: 40,
                text: 'Cek Profil',
                bgColor: brand.secondaryColor || '#ffffff',
                textColor: brand.primaryColor || '#000000',
                borderRadius: 9999,
                fontSize: 12,
                zIndex: 10,
                locked: false,
            },
        ];

        setElements(initialElements);
    }, [post, brand, slideOverride]);

    // Calculate scale for responsive
    useEffect(() => {
        const updateScale = () => {
            if (canvasRef.current) {
                const parentWidth = canvasRef.current.parentElement?.clientWidth || canvasSize.width;
                setScale(Math.min(1, parentWidth / canvasSize.width));
            }
        };
        updateScale();
        window.addEventListener('resize', updateScale);
        return () => window.removeEventListener('resize', updateScale);
    }, [canvasSize.width]);

    const updateElement = useCallback((id, updates) => {
        setElements(prev => prev.map(el => el.id === id ? { ...el, ...updates } : el));
    }, []);

    const deleteElement = useCallback(() => {
        if (selectedId) {
            setElements(prev => prev.filter(el => el.id !== selectedId));
            setSelectedId(null);
        }
    }, [selectedId]);

    const toggleLock = useCallback(() => {
        if (selectedId) {
            setElements(prev => prev.map(el => el.id === selectedId ? { ...el, locked: !el.locked } : el));
        }
    }, [selectedId]);

    const resetLayout = useCallback(() => {
        // Trigger re-initialization
        setElements([]);
        setSelectedId(null);
        setTimeout(() => {
            const isCarousel = post.type === 'carousel';
            const slides = isCarousel ? post.slides : [post];
            const currentData = slides[slideOverride] || post;
            setElements([
                { id: 'badge', type: 'shape', x: 12, y: 12, width: 120, height: 28, fill: 'rgba(255,255,255,0.2)', borderRadius: 4, border: '1px solid rgba(255,255,255,0.3)', zIndex: 5, locked: false },
                { id: 'badge-text', type: 'text', x: 12, y: 12, width: 120, height: 28, text: brand.name.toUpperCase(), fontSize: 9, fontWeight: 900, color: '#ffffff', letterSpacing: '0.2em', textAlign: 'center', zIndex: 6, locked: false },
                { id: 'headline', type: 'text', x: 32, y: 140, width: 336, height: 80, text: currentData.headline || 'Headline', fontSize: 28, fontWeight: 900, color: brand.secondaryColor || '#ffffff', textAlign: 'center', lineHeight: 1.1, zIndex: 10, locked: false },
                { id: 'body', type: 'text', x: 48, y: 225, width: 304, height: 50, text: currentData.body || 'Sub-headline', fontSize: 14, fontWeight: 500, color: 'rgba(255,255,255,0.9)', textAlign: 'center', zIndex: 10, locked: false },
                { id: 'cta', type: 'button', x: 120, y: 340, width: 160, height: 40, text: 'Cek Profil', bgColor: brand.secondaryColor || '#ffffff', textColor: brand.primaryColor || '#000000', borderRadius: 9999, fontSize: 12, zIndex: 10, locked: false },
            ]);
        }, 50);
    }, [post, brand, slideOverride]);

    const selectedElement = elements.find(el => el.id === selectedId);

    const isCarousel = post.type === 'carousel';
    const slides = isCarousel ? post.slides : [post];
    const currentData = slides[slideOverride] || post;

    return (
        <div className="w-full max-w-[400px] mx-auto">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-1">
                    <button
                        onClick={resetLayout}
                        className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all border border-slate-100"
                        title="Reset Layout"
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                    {selectedId && (
                        <>
                            <button
                                onClick={toggleLock}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-all border border-slate-100"
                                title={selectedElement?.locked ? 'Unlock' : 'Lock'}
                            >
                                {selectedElement?.locked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={deleteElement}
                                className="p-2 rounded-lg bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-500 transition-all border border-slate-100"
                                title="Hapus Element"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-1.5">
                    <Move className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs text-slate-400 font-medium">Drag & resize elemen</span>
                </div>
            </div>

            {/* Canvas */}
            <div
                ref={canvasRef}
                className="relative bg-white rounded-lg overflow-hidden border border-slate-200 shadow-sm"
                style={{
                    width: canvasSize.width * scale,
                    height: canvasSize.height * scale,
                }}
                onClick={() => setSelectedId(null)}
            >
                <div
                    style={{
                        width: canvasSize.width,
                        height: canvasSize.height,
                        transform: `scale(${scale})`,
                        transformOrigin: 'top left',
                        position: 'relative',
                    }}
                >
                    {/* Background image */}
                    <img
                        src={currentData.image || post.image}
                        className="absolute inset-0 w-full h-full object-cover"
                        alt=""
                        draggable={false}
                    />

                    {/* Overlay */}
                    <div
                        className="absolute inset-0"
                        style={{
                            backgroundColor: brand.primaryColor,
                            opacity: (post.overlayOpacity || 40) / 100,
                        }}
                    />

                    {/* Draggable elements */}
                    {elements.map((el) => (
                        <DraggableElement
                            key={el.id}
                            element={el}
                            isSelected={selectedId === el.id}
                            onSelect={setSelectedId}
                            onUpdate={updateElement}
                            scale={scale}
                        />
                    ))}
                </div>
            </div>

            {/* Selected element properties */}
            {selectedElement && (
                <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2 animation-fade-in">
                    <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">{selectedElement.id}</span>
                        <span className="text-[10px] text-slate-400">
                            {Math.round(selectedElement.x)}, {Math.round(selectedElement.y)} · {Math.round(selectedElement.width)}×{Math.round(selectedElement.height)}
                        </span>
                    </div>
                    {(selectedElement.type === 'text' || selectedElement.type === 'button') && (
                        <input
                            type="text"
                            value={selectedElement.text || ''}
                            onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                            className="w-full p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50"
                            placeholder="Teks..."
                        />
                    )}
                    {selectedElement.type === 'text' && (
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={selectedElement.fontSize || 16}
                                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 16 })}
                                className="w-20 p-2 rounded-lg border border-slate-200 bg-white text-sm outline-none"
                                title="Font size"
                                min={8}
                                max={72}
                            />
                            <input
                                type="color"
                                value={selectedElement.color || '#ffffff'}
                                onChange={(e) => updateElement(selectedElement.id, { color: e.target.value })}
                                className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer"
                                title="Warna teks"
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default CanvasEditor;
