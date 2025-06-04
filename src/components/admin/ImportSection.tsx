
import { FileUploadSection } from "@/components/admin/FileUploadSection";
import { ReprocessingSection } from "@/components/admin/ReprocessingSection";
import { ImportHistory } from "@/components/admin/ImportHistory";
import { GeminiEnrichmentSection } from "@/components/admin/GeminiEnrichmentSection";
import { useFileProcessing } from "@/hooks/useFileProcessing";

export function ImportSection() {
  const { 
    isLoading, 
    isReprocessing, 
    uploadedFiles, 
    handleUploadSuccess, 
    reprocessFile 
  } = useFileProcessing();

  return (
    <div className="grid gap-6">
      <FileUploadSection onUploadSuccess={handleUploadSuccess} />
      <ReprocessingSection 
        uploadedFiles={uploadedFiles} 
        isLoading={isLoading} 
        isReprocessing={isReprocessing} 
        onReprocess={reprocessFile} 
      />
      <GeminiEnrichmentSection />
      <ImportHistory />
    </div>
  );
}
