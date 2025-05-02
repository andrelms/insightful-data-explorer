
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, FileText } from "lucide-react";
import { ImportSection } from "@/components/admin/ImportSection";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { LogsSection } from "@/components/admin/LogsSection";

export function AdminTabs() {
  return (
    <Tabs defaultValue="import" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="import">
          <Upload className="h-4 w-4 mr-2" />
          Importação
        </TabsTrigger>
        <TabsTrigger value="database">
          <Database className="h-4 w-4 mr-2" />
          Banco de Dados
        </TabsTrigger>
        <TabsTrigger value="logs">
          <FileText className="h-4 w-4 mr-2" />
          Logs
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="import">
        <ImportSection />
      </TabsContent>
      
      <TabsContent value="database">
        <div className="grid gap-6">
          <DatabaseManagement />
        </div>
      </TabsContent>
      
      <TabsContent value="logs">
        <LogsSection />
      </TabsContent>
    </Tabs>
  );
}
