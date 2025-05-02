
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RefreshCw } from "lucide-react";

interface GeneralConfigSectionProps {
  notificationsEmail: string;
  enableAutoImport: boolean;
  enableNotifications: boolean;
  enablePublicSearch: boolean;
  setNotificationsEmail: (value: string) => void;
  setEnableAutoImport: (value: boolean) => void;
  setEnableNotifications: (value: boolean) => void;
  setEnablePublicSearch: (value: boolean) => void;
  handleSave: () => Promise<void>;
  isLoading: boolean;
}

export function GeneralConfigSection({
  notificationsEmail,
  enableAutoImport,
  enableNotifications,
  enablePublicSearch,
  setNotificationsEmail,
  setEnableAutoImport,
  setEnableNotifications,
  setEnablePublicSearch,
  handleSave,
  isLoading
}: GeneralConfigSectionProps) {
  return (
    <div className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="email-notifications">E-mail para Notificações</Label>
        <Input 
          id="email-notifications" 
          type="email"
          placeholder="seu@email.com" 
          value={notificationsEmail}
          onChange={(e) => setNotificationsEmail(e.target.value)}
        />
        <p className="text-xs text-muted-foreground mt-1">
          Este e-mail receberá notificações sobre novas convenções e atualizações
        </p>
      </div>
      
      <div className="space-y-4 mt-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-notifications">Notificações por email</Label>
            <p className="text-sm text-muted-foreground">
              Receba notificações sobre novas convenções.
            </p>
          </div>
          <Switch 
            id="enable-notifications" 
            checked={enableNotifications}
            onCheckedChange={setEnableNotifications}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-auto-import">Importação automática</Label>
            <p className="text-sm text-muted-foreground">
              Importar convenções do MTE automaticamente.
            </p>
          </div>
          <Switch 
            id="enable-auto-import" 
            checked={enableAutoImport}
            onCheckedChange={setEnableAutoImport}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="enable-public-search">Pesquisa pública</Label>
            <p className="text-sm text-muted-foreground">
              Permitir pesquisa sem autenticação.
            </p>
          </div>
          <Switch 
            id="enable-public-search" 
            checked={enablePublicSearch}
            onCheckedChange={setEnablePublicSearch}
          />
        </div>
      </div>
      
      <Button 
        onClick={handleSave}
        disabled={isLoading}
        className="mt-4"
      >
        {isLoading ? (
          <>
            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
            Salvando...
          </>
        ) : "Salvar Configurações"}
      </Button>
    </div>
  );
}
