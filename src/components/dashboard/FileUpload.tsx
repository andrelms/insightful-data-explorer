
import { useState } from "react";
import { Upload, FileText, Database, Check, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

type FileType = 'excel' | 'pdf' | 'csv';

interface FileUploadProps {
  acceptedFileTypes?: FileType[];
  maxFileSizeMB?: number;
  onUploadSuccess?: (file: File) => void;
}

export function FileUpload({
  acceptedFileTypes = ['excel', 'pdf', 'csv'],
  maxFileSizeMB = 10,
  onUploadSuccess
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const getAcceptedFileTypesString = () => {
    const typeMap = {
      excel: '.xlsx,.xls,.xlsm',
      pdf: '.pdf',
      csv: '.csv'
    };
    
    return acceptedFileTypes.map(type => typeMap[type]).join(',');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length) {
      validateAndSetFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files?.length) {
      validateAndSetFile(files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    // Check file size
    if (file.size > maxFileSizeMB * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: `O tamanho máximo permitido é de ${maxFileSizeMB}MB`,
        variant: "destructive"
      });
      return;
    }

    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    const isValidType = acceptedFileTypes.some(type => {
      if (type === 'excel' && ['xlsx', 'xls', 'xlsm'].includes(fileExtension || '')) return true;
      if (type === 'pdf' && fileExtension === 'pdf') return true;
      if (type === 'csv' && fileExtension === 'csv') return true;
      return false;
    });

    if (!isValidType) {
      toast({
        title: "Tipo de arquivo não suportado",
        description: `Por favor, envie arquivos nos formatos: ${acceptedFileTypes.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setIsUploading(true);
    setProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 10;
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsUploading(false);
            if (onUploadSuccess) {
              onUploadSuccess(selectedFile);
            }
            toast({
              title: "Upload concluído",
              description: `O arquivo ${selectedFile.name} foi processado com sucesso!`,
              duration: 5000,
            });
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 300);
  };

  const getFileIcon = () => {
    if (!selectedFile) return <Upload className="h-8 w-8 text-muted-foreground" />;
    
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    
    if (['xlsx', 'xls', 'xlsm'].includes(fileExtension || '')) {
      return <FileText className="h-8 w-8 text-green-500" />;
    } else if (fileExtension === 'pdf') {
      return <FileText className="h-8 w-8 text-red-500" />;
    } else if (fileExtension === 'csv') {
      return <Database className="h-8 w-8 text-blue-500" />;
    }
    
    return <FileText className="h-8 w-8 text-primary" />;
  };

  return (
    <div className="w-full">
      <Card className={cn(
        "border-2 border-dashed border-muted-foreground/20 rounded-xl",
        isDragging && "border-primary bg-primary/5",
        isUploading && "pointer-events-none opacity-70"
      )}>
        <CardContent className="p-0">
          <div
            className="flex flex-col items-center justify-center p-8 text-center"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="mb-4 p-4 rounded-full bg-muted/30">
              {getFileIcon()}
            </div>
            
            {!selectedFile ? (
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-1">Arraste seu arquivo ou</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Arquivos suportados: Excel, PDF, CSV (máx {maxFileSizeMB}MB)
                </p>
                <Button 
                  variant="outline" 
                  className="relative overflow-hidden px-6"
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  Escolher Arquivo
                  <input
                    id="file-upload"
                    type="file"
                    accept={getAcceptedFileTypesString()}
                    onChange={handleFileChange}
                    className="absolute left-0 top-0 h-full w-full opacity-0 cursor-pointer"
                  />
                </Button>
              </div>
            ) : (
              <div className="mb-4 w-full">
                <div className="flex items-center justify-between mb-2 border border-border p-3 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getFileIcon()}
                    <div className="text-left">
                      <p className="text-sm font-medium truncate max-w-[200px]">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  
                  {!isUploading ? (
                    <Check className="h-5 w-5 text-green-500" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  )}
                </div>
                
                {isUploading && (
                  <div className="w-full mt-4">
                    <Progress value={progress} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-1 text-right">{progress}% completo</p>
                  </div>
                )}
                
                {!isUploading && (
                  <div className="flex items-center justify-between mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleUpload}>
                      Processar Arquivo
                    </Button>
                  </div>
                )}
              </div>
            )}
            
            {!selectedFile && (
              <div className="text-xs text-muted-foreground flex items-center mt-4">
                <AlertCircle className="h-3 w-3 mr-1" />
                <span>Os arquivos serão processados pelo sistema para análise dos dados</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
