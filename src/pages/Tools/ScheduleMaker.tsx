import React, { useState, useEffect } from 'react';
import { Plus, Share2, Palette, Download, Check, Save, Trash2, FileUp } from 'lucide-react';
import ScrollReveal from '../../components/ui/ScrollReveal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { type ScheduleEntry, parseScheduleXLSX } from '../../utils/fileParsers';
import ToolHeader from '../../components/ui/ToolHeader';

import ScheduleGrid from '../../components/Schedule/ScheduleGrid';
import ThemePanel from '../../components/Schedule/ThemePanel';
import EntryForm from '../../components/Schedule/EntryForm';
import ExportModal from '../../components/Schedule/ExportModal';

const ScheduleGuide = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Class Scheduling</h3>
      <p>Organize your classes and activities in a weekly grid. Supports overlapping classes and custom themes.</p>
    </div>

    <div className="p-4 bg-[var(--primary)]/5 border-l-2 border-[var(--primary)] text-[11px]">
      <h3 className="text-[var(--primary)] font-heading text-sm uppercase tracking-widest mb-2">Portal Import</h3>
      <p>Quickly populate your schedule by importing your <strong>Registration Form (PDF/XLSX)</strong>. Make sure the file contains your subject names, times, and rooms.</p>
    </div>

    <div>
      <h3 className="text-[var(--foreground)] font-heading text-sm uppercase tracking-widest mb-2">Sharing</h3>
      <p>Use the <strong>Share URL</strong> button to copy a link to your current schedule. Anyone with the link can view (and optionally import) your schedule.</p>
    </div>

    <div className="p-4 bg-[var(--border)]/10 text-[11px]">
      <h3 className="text-[var(--foreground)] font-heading text-sm uppercase tracking-widest mb-2">Theming</h3>
      <p>Access the <strong>Style</strong> panel to change colors, fonts, and active days. Use "Render Type" to toggle between solid and outline subject cards.</p>
    </div>
  </div>
);

interface ScheduleConfig {
  theme: string;
  font: string;
  startHour: number;
  endHour: number;
  activeDays: string[];
}

const ScheduleMaker: React.FC = () => {
  const [localEntries, setLocalEntries] = useLocalStorage<ScheduleEntry[]>('jpcs-ue-schedule-entries', []);
  const [localConfig, setLocalConfig] = useLocalStorage<ScheduleConfig>('jpcs-ue-schedule-config', {
    theme: 'default',
    font: 'Outfit',
    startHour: 7,
    endHour: 21,
    activeDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  });

  // State for view-only sharing
  const [isViewOnly, setIsViewOnly] = useState(false);
  const [sharedData, setSharedData] = useState<{ entries: ScheduleEntry[], config: ScheduleConfig } | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showThemePanel, setShowThemePanel] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  
  const [newEntry, setNewEntry] = useState<Omit<ScheduleEntry, 'id'>>({
    subject: '',
    day: [],
    startTime: '07:30',
    endTime: '09:00',
    room: '',
    color: 'var(--primary)',
    renderType: 'solid'
  });

  // Handle URL Sharing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/share/', '');
      if (hash && hash.length > 10) {
        try {
          const decoded = JSON.parse(atob(hash));
          if (decoded.entries) {
            setSharedData(decoded);
            setIsViewOnly(true);
          }
        } catch (e) {
          console.error('Failed to parse shared schedule', e);
        }
      } else {
        setIsViewOnly(false);
        setSharedData(null);
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const entries = isViewOnly && sharedData ? sharedData.entries : localEntries;
  const config = isViewOnly && sharedData ? sharedData.config : localConfig;

  const handleImport = () => {
    if (window.confirm('Save this shared schedule as your own? This will overwrite your current schedule.')) {
      setLocalEntries(entries);
      setLocalConfig(config);
      setIsViewOnly(false);
      window.location.hash = ''; // Clear hash
    }
  };

  const shareSchedule = () => {
    const data = { entries, config };
    const hash = btoa(JSON.stringify(data));
    const url = `${window.location.origin}${window.location.pathname}#/share/${hash}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addEntry = () => {
    if (newEntry.subject && newEntry.day.length > 0) {
      if (editingEntryId) {
        // Update existing entry
        setLocalEntries(localEntries.map(e => 
          e.id === editingEntryId ? { ...newEntry, id: editingEntryId } : e
        ));
        setEditingEntryId(null);
      } else {
        // Add new entry
        setLocalEntries([...localEntries, { ...newEntry, id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substr(2, 9) }]);
      }
      
      setShowForm(false);
      setNewEntry({
        subject: '',
        day: [],
        startTime: '07:30',
        endTime: '09:00',
        room: '',
        color: 'var(--primary)',
        renderType: 'solid'
      });
    }
  };

  const editEntry = (id: string) => {
    const entry = localEntries.find(e => e.id === id);
    if (entry) {
      // Create a copy without the id property
      const { id: excludedId, ...entryWithoutId } = entry;
      // Use the excludedId in a comment to satisfy lint if necessary, 
      // or just don't name it. Better: delete property.
      console.log('Editing entry:', excludedId); 
      setNewEntry(entryWithoutId);
      setEditingEntryId(id);
      setShowForm(true);
      // Scroll to form
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const deleteEntry = (id: string) => {
    setLocalEntries(localEntries.filter(e => e.id !== id));
  };

  const clearAllEntries = () => {
    if (window.confirm('Are you sure you want to clear all entries? This action cannot be undone.')) {
      setLocalEntries([]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target?.result as ArrayBuffer;
      const importedEntries = parseScheduleXLSX(data);
      
      if (importedEntries.length > 0) {
        setLocalEntries([...localEntries, ...importedEntries]);
        alert(`Successfully imported ${importedEntries.length} entries.`);
      } else {
        alert('No valid entries found in the XLSX file.');
      }
    };
    reader.readAsArrayBuffer(file);
    e.target.value = '';
  };

  const dataActions = [];
  if (!isViewOnly) {
    dataActions.push(
      { 
        label: "Import XLSX", 
        icon: FileUp,
        component: (
          <label className="btn btn-ghost p-2 cursor-pointer" title="Import XLSX">
            <FileUp size={16} />
            <span className="text-[10px] uppercase tracking-widest hidden sm:inline">Import XLSX</span>
            <input type="file" accept=".xlsx, .xls" className="hidden" onChange={handleFileUpload} />
          </label>
        )
      },
      { label: "Clear All", icon: Trash2, onClick: clearAllEntries, className: "hover:bg-red-500/10 hover:text-red-500" }
    );
  }
  
  dataActions.push({ label: "Export Image", icon: Download, onClick: () => setShowExportModal(true) });

  return (
    <div className={`max-w-7xl mx-auto pb-20 px-4`}>
      <ToolHeader 
        title={isViewOnly ? 'Shared Schedule Preview' : 'Schedule Maker'}
        description={isViewOnly 
          ? 'Viewing a shared schedule. You can import it or export it as an image.' 
          : 'Customize your weekly routine and share it with your blockmates. Supports XLSX imports.'}
        helpContent={<ScheduleGuide />}
        primaryActions={isViewOnly ? [
          { label: "Make this mine", icon: Save, onClick: handleImport }
        ] : [
          { label: "New Class", icon: Plus, onClick: () => setShowForm(true) }
        ]}
        secondaryActions={[
          ...(!isViewOnly ? [{ label: "Style", icon: Palette, onClick: () => setShowThemePanel(!showThemePanel) }] : []),
          { 
            label: copied ? 'Copied Link' : 'Share URL', 
            icon: copied ? Check : Share2, 
            onClick: shareSchedule,
            className: copied ? "text-green-500 border-green-500/50" : ""
          }
        ]}
        dataActions={dataActions}
      />

      {showThemePanel && !isViewOnly && (
        <ThemePanel config={config} setConfig={setLocalConfig} />
      )}

      {showForm && !isViewOnly && (
        <EntryForm 
          newEntry={newEntry} 
          setNewEntry={setNewEntry} 
          onSave={addEntry} 
          onCancel={() => {
            setShowForm(false);
            setEditingEntryId(null);
            setNewEntry({
              subject: '',
              day: [],
              startTime: '07:30',
              endTime: '09:00',
              room: '',
              color: 'var(--primary)',
              renderType: 'solid'
            });
          }} 
          isEditing={!!editingEntryId}
        />
      )}

      <ScrollReveal animation="fade-up">
        <ScheduleGrid 
          entries={entries} 
          config={config} 
          isReadOnly={isViewOnly} 
          onDeleteEntry={deleteEntry} 
          onEditEntry={editEntry}
        />
      </ScrollReveal>

      {showExportModal && (
        <ExportModal 
          entries={entries} 
          config={config} 
          onClose={() => setShowExportModal(false)} 
        />
      )}
    </div>
  );
};

export default ScheduleMaker;
