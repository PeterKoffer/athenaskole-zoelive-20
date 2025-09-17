import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

// Types matching the BudgetGuard output
interface Usage {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  cost_usd?: number;
  model?: string;
}

interface StepLog {
  step: string;
  model: string;
  allowed: boolean;
  reason?: string;
  max_tokens: number;
  started_at: string;
  finished_at?: string;
  usage?: Usage;
}

interface BudgetReport {
  token_budget_total: number;
  tokens_used: number;
  tokens_remaining: number;
  usd_spent_est: number;
  steps: StepLog[];
}

interface Entry {
  id: string;
  time: string;
  label?: string;
  report: BudgetReport;
}

interface BudgetDebugContextType {
  postBudgetReport: (report: BudgetReport, label?: string) => void;
  entries: Entry[];
  clearHistory: () => void;
}

const BudgetDebugContext = createContext<BudgetDebugContextType | null>(null);

export function BudgetDebugProvider({ children }: { children: React.ReactNode }) {
  const [entries, setEntries] = useState<Entry[]>([]);

  const postBudgetReport = useCallback((report: BudgetReport, label?: string) => {
    const entry: Entry = {
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      label,
      report,
    };
    setEntries(prev => [entry, ...prev.slice(0, 19)]); // keep last 20
  }, []);

  const clearHistory = useCallback(() => {
    setEntries([]);
  }, []);

  const value = useMemo(() => ({
    postBudgetReport,
    entries,
    clearHistory,
  }), [postBudgetReport, entries, clearHistory]);

  return (
    <BudgetDebugContext.Provider value={value}>
      {children}
      <BudgetDebugOverlay />
    </BudgetDebugContext.Provider>
  );
}

export function useBudgetDebug() {
  const context = useContext(BudgetDebugContext);
  if (!context) {
    throw new Error("useBudgetDebug must be used within BudgetDebugProvider");
  }
  return context;
}

function BudgetDebugOverlay() {
  const { entries, clearHistory } = useBudgetDebug();
  const [visible, setVisible] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [dragging, setDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; startPosX: number; startPosY: number } | null>(null);

  // Toggle visibility with Ctrl/Cmd + Shift + D or URL param
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
        e.preventDefault();
        setVisible(v => !v);
      }
    };

    // Check URL param
    const params = new URLSearchParams(window.location.search);
    if (params.get('debug') === '1') {
      setVisible(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Auto-show when new entry arrives (if not explicitly hidden)
  useEffect(() => {
    if (entries.length > 0 && !visible && !pinned) {
      setVisible(true);
      // Auto-hide after 10s if not pinned
      const timer = setTimeout(() => {
        if (!pinned) setVisible(false);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [entries.length, visible, pinned]);

  // Dragging logic
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target !== e.currentTarget) return; // only drag from header
    e.preventDefault();
    setDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPosX: position.x,
      startPosY: position.y,
    };
  }, [position]);

  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 320, dragRef.current.startPosX + deltaX)),
        y: Math.max(0, Math.min(window.innerHeight - 200, dragRef.current.startPosY + deltaY)),
      });
    };

    const handleMouseUp = () => {
      setDragging(false);
      dragRef.current = null;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging]);

  if (!visible || entries.length === 0) return null;

  const latest = entries[0];

  return (
    <div
      className="fixed z-[9999] bg-gray-900/95 border border-gray-600 rounded-lg shadow-xl backdrop-blur-sm"
      style={{
        left: position.x,
        top: position.y,
        width: 320,
        fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 py-2 bg-gray-800 rounded-t-lg cursor-move select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="text-xs font-medium text-white">Budget Debug</div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setPinned(!pinned)}
            className={`text-xs px-2 py-1 rounded ${pinned ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
          >
            {pinned ? 'Pinned' : 'Pin'}
          </button>
          <button
            onClick={() => setVisible(false)}
            className="text-xs px-2 py-1 rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
          >
            ×
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 text-xs text-gray-200">
        <Overview report={latest.report} />
        <Steps steps={latest.report.steps} />
        <Actions entry={latest} onClear={clearHistory} />
        <History entries={entries.slice(1)} />
        <Hint />
      </div>
    </div>
  );
}

function Overview({ report }: { report: BudgetReport }) {
  const usagePercent = Math.round((report.tokens_used / report.token_budget_total) * 100);
  const costDisplay = (report.usd_spent_est || 0).toFixed(4);

  return (
    <div className="mb-3">
      <div className="flex items-center justify-between mb-1">
        <div className="text-white font-medium">Tokens</div>
        <div className="text-gray-400">{report.tokens_used} / {report.token_budget_total}</div>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-2 mb-2">
        <div
          className={`h-2 rounded-full transition-all ${usagePercent > 90 ? 'bg-rose-500' : usagePercent > 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
          style={{ width: `${Math.min(100, usagePercent)}%` }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="text-gray-400">Cost</div>
        <div className="text-white">${costDisplay}</div>
      </div>
    </div>
  );
}

function Steps({ steps }: { steps: StepLog[] }) {
  return (
    <div className="mb-3">
      <div className="text-white font-medium mb-2">Steps ({steps.length})</div>
      <div className="grid grid-cols-6 gap-1 text-[10px] text-gray-400 px-2 py-1 border-b border-gray-800">
        <div>Step</div>
        <div>Model</div>
        <div>OK</div>
        <div>Max</div>
        <div>Used</div>
        <div>Reason</div>
      </div>
      <div className="max-h-[28vh] overflow-auto">
        {steps.map((s, i) => (
          <div key={i} className="grid grid-cols-6 gap-1 text-[10px] px-2 py-1 border-t border-gray-800/60">
            <div className="truncate" title={s.step}>{s.step}</div>
            <div className="truncate" title={s.model}>{s.model}</div>
            <div className={s.allowed ? "text-emerald-400" : "text-rose-400"}>{s.allowed ? "yes" : "no"}</div>
            <div>{s.max_tokens}</div>
            <div title={`prompt:${s.usage?.prompt_tokens||0} comp:${s.usage?.completion_tokens||0}`}>{s.usage?.total_tokens ?? 0}</div>
            <div className="truncate" title={s.reason}>{s.reason ?? ""}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Actions({ entry, onClear }: { entry: Entry; onClear: () => void }) {
  const copyJSON = useCallback(() => {
    const payload = JSON.stringify(entry.report, null, 2);
    navigator.clipboard.writeText(payload).catch(() => {});
  }, [entry]);

  const download = useCallback(() => {
    const blob = new Blob([JSON.stringify(entry.report, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; 
    a.download = `nelie-budget-${entry.time}.json`; 
    a.click();
    URL.revokeObjectURL(url);
  }, [entry]);

  return (
    <div className="mt-2 flex items-center gap-2">
      <button onClick={copyJSON} className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">Copy JSON</button>
      <button onClick={download} className="text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">Download</button>
      <button onClick={onClear} className="ml-auto text-xs px-2 py-1 rounded bg-gray-800 hover:bg-gray-700">Clear</button>
    </div>
  );
}

function History({ entries }: { entries: Entry[] }) {
  return (
    <div className="mt-2">
      <div className="text-[10px] text-gray-400 mb-1">History ({entries.length})</div>
      <div className="max-h-[12vh] overflow-auto space-y-1">
        {entries.map((e) => (
          <div key={e.id} className="text-[10px] flex items-center justify-between px-2 py-1 rounded bg-gray-800/40">
            <div className="truncate max-w-[60%]" title={e.label || "(no label)"}>{e.label || "(no label)"}</div>
            <div className="text-gray-400">{new Date(e.time).toLocaleTimeString()}</div>
            <div className="text-gray-400">${(e.report.usd_spent_est || 0).toFixed(4)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Hint() {
  return (
    <div className="mt-2 text-[10px] text-gray-500">
      Toggle with <kbd className="px-1 py-0.5 bg-gray-800 rounded">Ctrl/Cmd</kbd>+<kbd className="px-1 py-0.5 bg-gray-800 rounded">Shift</kbd>+<kbd className="px-1 py-0.5 bg-gray-800 rounded">D</kbd> • Or add <code>?debug=1</code> to URL
    </div>
  );
}