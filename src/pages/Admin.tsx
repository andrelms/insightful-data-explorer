
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, Settings, FileText } from "lucide-react";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { ImportSection } from "@/components/admin/ImportSection";
import { ConfigSection } from "@/components/admin/ConfigSection";
import { LogsSection } from "@/components/admin/LogsSection";

const Admin = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Área Administrativa</h1>
        <p className="text-muted-foreground">
          Gerencie a importação de dados, configure o banco de dados e monitore o sistema.
        </p>
      </div>

      <Tabs defaultValue="import" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="import">
            <Upload className="h-4 w-4 mr-2" />
            Importação
          </TabsTrigger>
          <TabsTrigger value="database">
            <Database className="h-4 w-4 mr-2" />
            Banco de Dados
          </TabsTrigger>
          <TabsTrigger value="config">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
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
        
        <TabsContent value="config">
          <ConfigSection />
        </TabsContent>
        
        <TabsContent value="logs">
          <LogsSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Admin;
