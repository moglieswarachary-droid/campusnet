import React, { useState, useRef } from 'react';
import { Upload, FileText, CheckCircle2, AlertCircle, X, Eye } from 'lucide-react';
import { EventHostingDocument } from '../../types';
import { validateDocumentUpload } from '../../utils/validation';

interface DocumentUploadFieldProps {
  label: string;
  type: 'institution_proof' | 'formal_request_letter' | 'other';
  required?: boolean;
  helpText: string;
  document: EventHostingDocument | null;
  onDocumentChange: (doc: EventHostingDocument | null) => void;
}

export const DocumentUploadField: React.FC<DocumentUploadFieldProps> = ({
  label,
  type,
  required = false,
  helpText,
  document,
  onDocumentChange
}) => {
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = (file: File) => {
    setError(null);
    const validation = validateDocumentUpload(file);

    if (!validation.isValid) {
      setError(validation.error || 'Invalid document file');
      return;
    }

    // Convert file to mock secure URL / Data URL for runtime demonstration
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newDoc: EventHostingDocument = {
        id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        eventId: '',
        type,
        title: label,
        fileName: file.name,
        fileUrl: dataUrl || URL.createObjectURL(file),
        fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        mimeType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString(),
        verifiedByAdmin: false
      };
      onDocumentChange(newDoc);
    };
    reader.readAsDataURL(file);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-campus-deep-blue uppercase tracking-wider flex items-center gap-1">
          <span>{label}</span>
          {required && <span className="text-campus-red font-black">*</span>}
        </label>
        <span className="text-[11px] text-campus-muted-text">PDF, PNG, JPG (Max 10MB)</span>
      </div>

      {document ? (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-warm-xs">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-campus-deep-blue truncate">{document.fileName}</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              </div>
              <p className="text-[11px] text-campus-muted-text">
                {document.fileSize} • Uploaded {new Date(document.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={document.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
              title="Preview Document"
            >
              <Eye className="w-4 h-4" />
            </a>
            <button
              type="button"
              onClick={() => onDocumentChange(null)}
              className="p-1.5 rounded-lg bg-white hover:bg-red-50 text-red-600 border border-slate-200 transition-colors"
              title="Remove File"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleFileDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`p-5 rounded-2xl border-2 border-dashed transition-all cursor-pointer text-center space-y-2 ${
            isDragging 
              ? 'border-campus-blue bg-campus-soft-blue/60 scale-[1.01]' 
              : error 
              ? 'border-red-400 bg-red-50/50' 
              : 'border-campus-border/80 hover:border-campus-blue/60 bg-slate-50/70 hover:bg-slate-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-10 h-10 rounded-2xl bg-white border border-campus-border shadow-warm-xs text-campus-blue mx-auto flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>

          <div>
            <p className="text-xs font-bold text-campus-deep-blue">
              Click to browse or drag & drop official document
            </p>
            <p className="text-[11px] text-campus-muted-text mt-0.5">{helpText}</p>
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-1.5 text-xs text-red-600 pt-0.5">
          <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
