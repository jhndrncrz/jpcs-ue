import React, { useState, useRef } from 'react';
import { X, Download, Smartphone, Maximize, Square, Check } from 'lucide-react';
import { toPng } from 'html-to-image';
import ScrollReveal from '../ui/ScrollReveal';
import ScheduleGrid from './ScheduleGrid';
import { type ScheduleEntry } from '../../utils/fileParsers';
import { THEMES } from './constants';

interface ScheduleConfig {
  theme: string;
  font: string;
  startHour: number;
  endHour: number;
  activeDays: string[];
}

interface ExportModalProps {
  entries: ScheduleEntry[];
  config: ScheduleConfig;
  onClose: () => void;
}

const PRESETS = [
  { id: 'wallpaper', name: 'Phone Wallpaper', icon: Smartphone, width: 1080, height: 1920, description: 'Optimized for mobile lockscreens' },
  { id: 'square', name: 'Social Square', icon: Square, width: 1080, height: 1080, description: 'Perfect for Instagram or Discord' },
  { id: 'standard', name: 'Standard View', icon: Maximize, width: 1920, height: 1080, description: 'Full desktop resolution' },
  { id: 'custom', name: 'Custom Resolution', icon: Maximize, width: 1280, height: 720, description: 'Define your own dimensions' },
];

const ExportModal: React.FC<ExportModalProps> = ({ entries, config, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState(PRESETS[0]);
  const [customWidth, setCustomWidth] = useState(1280);
  const [customHeight, setCustomHeight] = useState(720);
  const [isExporting, setIsExporting] = useState(false);
  const [exportDone, setExportDone] = useState(false);
  const [scheduleScale, setScheduleScale] = useState(1);
  const [previewScale, setPreviewScale] = useState(1);
  const exportRef = useRef<HTMLDivElement>(null);
  const exportContentRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const previewViewportRef = useRef<HTMLDivElement>(null);

  const currentWidth = selectedPreset.id === 'custom' ? customWidth : selectedPreset.width;
  const currentHeight = selectedPreset.id === 'custom' ? customHeight : selectedPreset.height;
  const isWallpaper = selectedPreset.id === 'wallpaper';
  const activeTheme = THEMES[config.theme as keyof typeof THEMES] || THEMES.default;
  const framePaddingX = isWallpaper ? 32 : 40;
  const framePaddingBottom = isWallpaper ? 48 : 40;

  React.useLayoutEffect(() => {
    const updateScales = () => {
      if (exportContentRef.current && measureRef.current) {
        const availableWidth = exportContentRef.current.clientWidth;
        const availableHeight = exportContentRef.current.clientHeight;
        const contentWidth = measureRef.current.scrollWidth;
        const contentHeight = measureRef.current.scrollHeight;

        if (availableWidth > 0 && availableHeight > 0 && contentWidth > 0 && contentHeight > 0) {
          const widthScale = availableWidth / contentWidth;
          const heightScale = availableHeight / contentHeight;
          setScheduleScale(Math.min(widthScale, heightScale));
        }
      }

      if (previewViewportRef.current && currentWidth > 0 && currentHeight > 0) {
        const availableWidth = previewViewportRef.current.clientWidth;
        const availableHeight = previewViewportRef.current.clientHeight;

        if (availableWidth > 0 && availableHeight > 0) {
          setPreviewScale(Math.min(availableWidth / currentWidth, availableHeight / currentHeight));
        }
      }
    };

    const observer = new ResizeObserver(updateScales);

    if (exportContentRef.current) {
      observer.observe(exportContentRef.current);
    }

    if (measureRef.current) {
      observer.observe(measureRef.current);
    }

    if (previewViewportRef.current) {
      observer.observe(previewViewportRef.current);
    }

    updateScales();
    document.fonts?.ready.then(updateScales).catch(() => undefined);

    return () => observer.disconnect();
  }, [currentWidth, currentHeight, entries, config, isWallpaper]);

  const frameStyle: React.CSSProperties = {
    width: `${currentWidth}px`,
    height: `${currentHeight}px`,
    backgroundColor: activeTheme.bg || '#ffffff',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  };

  const contentStyle: React.CSSProperties = {
    flex: 1,
    paddingLeft: `${framePaddingX}px`,
    paddingRight: `${framePaddingX}px`,
    paddingBottom: `${framePaddingBottom}px`,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative'
  };

  const gridScaleStyle: React.CSSProperties = {
    transform: `scale(${scheduleScale})`,
    transformOrigin: 'top center',
    width: 'max-content'
  };

  const renderFrame = (mode: 'export' | 'preview') => {
    const isExportFrame = mode === 'export';

    return (
      <div ref={isExportFrame ? exportRef : undefined} style={frameStyle}>
        {isWallpaper && (
          <div className="pt-24 pb-12 px-12 text-center">
            <div className="text-[var(--primary)] font-heading text-sm tracking-[0.4em] uppercase mb-4 opacity-80">Weekly Schedule</div>
            <div className="text-[var(--foreground)] font-title text-5xl">My Classes</div>
          </div>
        )}

        <div ref={isExportFrame ? exportContentRef : undefined} style={contentStyle}>
          {isExportFrame && (
            <div className="absolute left-0 top-0 opacity-0 pointer-events-none" aria-hidden="true">
              <div ref={measureRef} className="w-max">
                <ScheduleGrid entries={entries} config={config} isReadOnly={true} exportMode={true} />
              </div>
            </div>
          )}

          <div style={gridScaleStyle}>
            <ScheduleGrid entries={entries} config={config} isReadOnly={true} exportMode={true} />
          </div>
        </div>

        <div className="py-12 text-center">
          <div className="font-logo text-sm tracking-[0.5em] text-[var(--foreground-muted)] opacity-40">JPCS - UE MANILA</div>
        </div>
      </div>
    );
  };

  const handleExport = async () => {
    if (!exportRef.current) return;
    
    setIsExporting(true);
    try {
      await document.fonts?.ready;
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const dataUrl = await toPng(exportRef.current, {
        quality: 1.0,
        pixelRatio: 2, 
        backgroundColor: activeTheme.bg || '#ffffff',
        width: currentWidth,
        height: currentHeight,
        style: {
          transform: 'none',
          width: `${currentWidth}px`,
          height: `${currentHeight}px`,
          margin: '0',
          padding: '0'
        }
      });
      
      const link = document.createElement('a');
      link.download = `jpcs-schedule-${selectedPreset.id}-${new Date().getTime()}.png`;
      link.href = dataUrl;
      link.click();
      
      setExportDone(true);
      setTimeout(() => setExportDone(false), 3000);
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <ScrollReveal animation="fade-up" className="w-full max-w-6xl bg-[var(--background)] border border-[var(--border)] shadow-2xl overflow-hidden flex flex-col md:flex-row h-[95vh]">
        {/* Sidebar / Controls */}
        <div className="w-full md:w-80 border-r border-[var(--border)] p-6 flex flex-col bg-[var(--surface)]">
          <div className="flex justify-between items-center mb-8">
            <h3 className="font-heading text-lg font-bold text-[var(--foreground)] tracking-tight">Export Schedule</h3>
            <button onClick={onClose} className="text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 flex-1">
            <label className="text-[10px] uppercase font-heading text-[var(--foreground-muted)] tracking-widest opacity-70">Resolution Preset</label>
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setSelectedPreset(preset)}
                className={`w-full p-4 border text-left transition-all flex items-start gap-4 rounded-sm ${selectedPreset.id === preset.id ? 'border-[var(--primary)] bg-[var(--primary)]/10' : 'border-[var(--border)] hover:border-[var(--foreground-muted)]'}`}
              >
                <div className={`p-2.5 rounded-md ${selectedPreset.id === preset.id ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/20' : 'bg-[var(--background)] text-[var(--foreground-muted)]'}`}>
                  <preset.icon size={20} />
                </div>
                <div className="min-w-0">
                  <div className={`text-xs font-heading font-bold truncate ${selectedPreset.id === preset.id ? 'text-[var(--foreground)]' : 'text-[var(--foreground-muted)]'}`}>{preset.name}</div>
                  <div className="text-[10px] text-[var(--foreground-muted)] mt-1 opacity-80">
                    {preset.id === 'custom' ? `${customWidth}x${customHeight}px` : `${preset.width}x${preset.height}px`}
                  </div>
                </div>
              </button>
            ))}

            {selectedPreset.id === 'custom' && (
              <div className="grid grid-cols-2 gap-3 mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-[var(--foreground-muted)] opacity-60">Width</label>
                  <input 
                    type="number" 
                    value={customWidth} 
                    onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1280)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] p-2 text-xs focus:ring-1 focus:ring-[var(--primary)] outline-none rounded-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] uppercase font-bold text-[var(--foreground-muted)] opacity-60">Height</label>
                  <input 
                    type="number" 
                    value={customHeight} 
                    onChange={(e) => setCustomHeight(parseInt(e.target.value) || 720)}
                    className="w-full bg-[var(--background)] border border-[var(--border)] p-2 text-xs focus:ring-1 focus:ring-[var(--primary)] outline-none rounded-sm"
                  />
                </div>
              </div>
            )}
          </div>

           {scheduleScale < 0.4 && (
             <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 text-[10px] text-red-400 leading-relaxed rounded-sm animate-pulse">
               <strong>Readability Warning:</strong> The requested resolution is too small to fit the schedule comfortably. Text may be difficult to read.
             </div>
          )}

          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full btn btn-primary py-4 flex items-center justify-center gap-3 font-heading text-xs uppercase tracking-[0.2em] mt-6 shadow-xl"
          >
            {exportDone ? (
              <><Check size={18} /> Ready!</>
            ) : isExporting ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><Download size={18} /> Save PNG</>
            )}
          </button>
        </div>

        {/* Preview Area */}
        <div className="flex-1 bg-[#0a0a0a] p-12 overflow-hidden flex items-center justify-center relative">
          <div className="absolute top-6 left-8 text-[10px] font-heading text-white/30 uppercase tracking-[0.3em] z-10">
            Export Preview ({currentWidth}x{currentHeight})
          </div>
          
          <div className="opacity-0 pointer-events-none absolute -top-[5000px] left-0 overflow-hidden">
            {renderFrame('export')}
          </div>

          {/* Scaled UI Preview */}
          <div
            ref={previewViewportRef}
            className="relative flex items-center justify-center p-4 bg-black/40 rounded-lg shadow-inner"
            style={{ 
            height: '90%',
            width: '90%',
            maxHeight: '75vh'
          }}>
            <div 
              className="shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden relative"
              style={{ 
                width: `${currentWidth}px`,
                height: `${currentHeight}px`,
                transform: `scale(${previewScale})`,
                transformOrigin: 'center center'
              }}
            >
              {renderFrame('preview')}
            </div>

            {/* Phone Frame Mockup (Preview Only Overlay) */}
            {isWallpaper && (
              <div className="absolute inset-0 pointer-events-none border-[14px] border-[#151515] rounded-[3.5rem] shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_40px_rgba(0,0,0,0.3)]" style={{ transform: 'scale(1.02)' }}>
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#151515] rounded-b-3xl flex items-center justify-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/5" />
                  <div className="w-8 h-1 rounded-full bg-white/10" />
                </div>
                {/* Buttons Mockup */}
                <div className="absolute left-[-16px] top-32 w-1 h-12 bg-[#151515] rounded-l-md" />
                <div className="absolute right-[-16px] top-40 w-1 h-20 bg-[#151515] rounded-r-md" />
              </div>
            )}
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
};

export default ExportModal;
