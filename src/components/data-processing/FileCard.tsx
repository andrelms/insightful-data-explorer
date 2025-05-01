
import React from "react";
import { FileText, Database } from "lucide-react";

interface FileCardProps {
  file: File;
}

export function FileCard({ file }: FileCardProps) {
  return (
    <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
      {file.name.endsWith('.pdf') ? 
        <FileText className="h-10 w-10 text-red-500" /> : 
        <Database className="h-10 w-10 text-green-500" />
      }
      <div>
        <h3 className="font-medium">{file.name}</h3>
        <p className="text-sm text-muted-foreground">
          {(file.size / (1024 * 1024)).toFixed(2)} MB
        </p>
      </div>
    </div>
  );
}
