
import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { FileUpload } from "@/components/dashboard/FileUpload";
import { AlertCircle, Database, FileText } from "lucide-react";

interface UploadTabProps {
  onFileUploaded: (file: File) => Promise<void>;
}

export function UploadTab({ onFileUploaded }: UploadTabProps) {
  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle>Upload de Dados</CardTitle>
          <CardDescription>
            Faça upload de arquivos Excel ou PDF com dados de convenções coletivas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileUpload acceptedFileTypes={['excel', 'pdf']} onUploadSuccess={onFileUploaded} />
          <div className="mt-4 p-4 bg-muted/30 rounded text-sm">
            <div className="flex items-center gap-2 mb-2 text-primary font-medium">
              <AlertCircle className="h-4 w-4" />
              <span>Tipos de arquivos suportados:</span>
            </div>
            <ul className="space-y-2 text-muted-foreground">
              <li className="flex items-center gap-2">
                <Database className="h-4 w-4 text-green-500" />
                <span>Excel (.xlsx, .xls): Dados tabulares estruturados de convenções</span>
              </li>
              <li className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-red-500" />
                <span>PDF (.pdf): Documentos de convenções coletivas</span>
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
