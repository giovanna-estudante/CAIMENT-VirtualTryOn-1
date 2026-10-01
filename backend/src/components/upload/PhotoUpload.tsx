import { useRef } from 'react';
import { Camera, RotateCw, Trash2, Check } from 'lucide-react';
import type { AvatarPhoto } from '@/types';
import { cn } from '@/utils/cn';

interface PhotoUploadProps {
  photo: AvatarPhoto;
  label: string;
  onChange: (angle: AvatarPhoto['angle'], file: File) => void;
  onRemove: (angle: AvatarPhoto['angle']) => void;
}

export function PhotoUpload({ photo, label, onChange, onRemove }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (file) onChange(photo.angle, file);
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className={cn(
          'relative flex aspect-[3/4] w-full items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed transition-colors',
          photo.previewUrl
            ? 'border-transparent'
            : 'border-caiment-purple-200 bg-caiment-purple-50/50 hover:border-caiment-purple-300 hover:bg-caiment-purple-50 cursor-pointer',
        )}
        onClick={() => !photo.previewUrl && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />

        {photo.previewUrl ? (
          <>
            <img src={photo.previewUrl} alt={label} className="h-full w-full object-cover" />
            <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-caiment-lime">
              <Check size={13} className="text-caiment-ink" />
            </span>
            <div className="absolute inset-x-0 bottom-0 flex justify-center gap-2 bg-gradient-to-t from-black/60 to-transparent p-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  inputRef.current?.click();
                }}
                className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-caiment-ink hover:bg-white"
              >
                <RotateCw size={12} /> Substituir
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(photo.angle);
                }}
                className="flex items-center gap-1 rounded-full bg-white/90 px-3 py-1.5 text-xs font-medium text-red-500 hover:bg-white"
              >
                <Trash2 size={12} /> Remover
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-caiment-ink-soft">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm">
              <Camera size={18} className="text-caiment-purple-400" />
            </span>
            <span className="text-xs font-medium">Adicionar foto</span>
          </div>
        )}
      </div>
      <p className="mt-2 text-xs font-medium text-caiment-ink-soft">{label}</p>
    </div>
  );
}
