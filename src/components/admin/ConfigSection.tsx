
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeminiConfigSection } from "./config/GeminiConfigSection";
import { MteConfigSection } from "./config/MteConfigSection";
import { GeneralConfigSection } from "./config/GeneralConfigSection";
import { useConfigSettings } from "@/hooks/useConfigSettings";

export function ConfigSection() {
  const {
    isLoading,
    geminiKey,
    mteUrl,
    mteToken,
    notificationsEmail,
    enableAutoImport,
    enableNotifications,
    enablePublicSearch,
    setGeminiKey,
    setMteUrl,
    setMteToken,
    setNotificationsEmail,
    setEnableAutoImport,
    setEnableNotifications,
    setEnablePublicSearch,
    handleSaveGeminiKey,
    handleSaveMteSettings,
    handleSaveGeneralSettings
  } = useConfigSettings();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Sistema</CardTitle>
        <CardDescription>
          Gerencie as chaves de API e outras configurações do sistema.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="integration">Integração MTE</TabsTrigger>
            <TabsTrigger value="ai">Inteligência Artificial</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <GeneralConfigSection
              notificationsEmail={notificationsEmail}
              enableAutoImport={enableAutoImport}
              enableNotifications={enableNotifications}
              enablePublicSearch={enablePublicSearch}
              setNotificationsEmail={setNotificationsEmail}
              setEnableAutoImport={setEnableAutoImport}
              setEnableNotifications={setEnableNotifications}
              setEnablePublicSearch={setEnablePublicSearch}
              handleSave={handleSaveGeneralSettings}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="integration">
            <MteConfigSection
              mteUrl={mteUrl}
              mteToken={mteToken}
              setMteUrl={setMteUrl}
              setMteToken={setMteToken}
              handleSave={handleSaveMteSettings}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="ai">
            <GeminiConfigSection
              geminiKey={geminiKey}
              setGeminiKey={setGeminiKey}
              handleSave={handleSaveGeminiKey}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
