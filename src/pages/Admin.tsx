
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, Database, Settings, FileText, AlertCircle } from "lucide-react";
import { DatabaseManagement } from "@/components/admin/DatabaseManagement";
import { ImportSection } from "@/components/admin/ImportSection";
import { ConfigSection } from "@/components/admin/ConfigSection";
import { LogsSection } from "@/components/admin/LogsSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Área Administrativa</h1>
        <p className="text-muted-foreground">
          Gerencie a importação de dados, configure o banco de dados e monitore o sistema.
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader className="bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white">
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Status do Sistema
          </CardTitle>
          <CardDescription className="text-blue-100">
            Monitore o estado atual do sistema e acesse funções administrativas.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6 grid gap-6 md:grid-cols-2">
          <div className="flex flex-col gap-2 p-4 border rounded-lg">
            <h3 className="text-sm font-semibold">Recursos do Sistema</h3>
            <div className="grid grid-cols-2 gap-2 mt-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/")}>Dashboard</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/processar-dados")}>Processar Dados</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/painel-sindicatos")}>Painel Sindicatos</Button>
              <Button variant="outline" size="sm" onClick={() => navigate("/convencoes")}>Convenções</Button>
            </div>
          </div>
          <div className="flex flex-col gap-2 p-4 border rounded-lg">
            <h3 className="text-sm font-semibold">Banco de Dados</h3>
            <div className="flex items-center justify-between mt-2">
              <span className="text-sm text-muted-foreground">Conexão</span>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Ativa</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Última sincronização</span>
              <span className="text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
