import * as React from "react";
import { useCallback, useState } from "react";
import { Upload, X } from "lucide-react";

import { cn } from "../../utils/cn";

interface FileUploadProps {
  label: string;
  sublabel: string;
  acceptedFileTypes?: string;
  maxFileSize?: number;
  onFileChange?: (file: File | null) => void;
  className?: string;
}

export function FileUpload({
  label,
  sublabel,
  acceptedFileTypes = "*",
  maxFileSize = 10485760, // 10MB default
  onFileChange,
  className,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = useCallback(
    (selectedFile: File | null) => {
      setError(null);

      if (!selectedFile) {
        setFile(null);
        onFileChange && onFileChange(null);
        return;
      }

      // Validate file type if specified
      if (
        acceptedFileTypes !== "*" &&
        !selectedFile.type.match(acceptedFileTypes)
      ) {
        setError(
          `File type not accepted. Please upload ${acceptedFileTypes.replace(
            "*",
            ""
          )}.`
        );
        return;
      }

      // Validate file size
      if (selectedFile.size > maxFileSize) {
        setError(
          `File is too large. Maximum size is ${maxFileSize / 1048576}MB.`
        );
        return;
      }

      setFile(selectedFile);
      onFileChange && onFileChange(selectedFile);
    },
    [acceptedFileTypes, maxFileSize, onFileChange]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFileChange(e.dataTransfer.files[0]);
      }
    },
    [handleFileChange]
  );

  const handleButtonClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemoveFile = useCallback(() => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileChange && onFileChange(null);
  }, [onFileChange]);

  return (
    <div className={cn("w-full", className)}>
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-6 border-2 border-dashed rounded-lg transition-colors",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50",
          file ? "bg-gray-50 dark:bg-gray-900/50" : "",
          error ? "border-red-500 bg-red-50 dark:bg-red-900/10" : ""
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-between w-full p-3 mb-2 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-2 truncate">
                <Upload className="w-5 h-5 text-primary" />
                <span className="text-sm font-medium truncate">
                  {file.name}
                </span>
              </div>

              <button
                type="button"
                className="flex items-center justify-center w-full h-full"
                onClick={handleRemoveFile}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={acceptedFileTypes}
              onChange={(e) => {
                const files = e.target.files;
                handleFileChange(files && files.length > 0 ? files[0] : null);
              }}
            />
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="p-3 rounded-full bg-primary/10">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium">{label}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                {sublabel}
              </p>

              <button
                type="button"
                className="flex items-center justify-center w-full h-full"
                onClick={handleButtonClick}
              >
                Select File
              </button>
            </div>
          </>
        )}

        {error && (
          <div className="absolute bottom-2 left-0 right-0 px-6">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}
