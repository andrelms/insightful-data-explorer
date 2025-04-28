
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RefreshCw, Upload, Link, Calendar, FileSpreadsheet, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { ImportHistory } from "./ImportHistory";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function ImportSection() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFileUploading, setIsFileUploading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [importFilter, setImportFilter] = useState("tpRequerimento=convencao");
  const [estadoSelecionado, setEstadoSelecionado] = useState<string>("");
  const [abrangencia, setAbrangencia] = useState<string[]>(["municipal", "intermunicipal", "estadual", "interestadual", "nacional"]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const estados = [
    { valor: "AC", nome: "Acre" },
    { valor: "AL", nome: "Alagoas" },
    { valor: "AP", nome: "Amapá" },
    { valor: "AM", nome: "Amazonas" },
    { valor: "BA", nome: "Bahia" },
    { valor: "CE", nome: "Ceará" },
    { valor: "DF", nome: "Distrito Federal" },
    { valor: "ES", nome: "Espírito Santo" },
    { valor: "GO", nome: "Goiás" },
    { valor: "MA", nome: "Maranhão" },
    { valor: "MT", nome: "Mato Grosso" },
    { valor: "MS", nome: "Mato Grosso do Sul" },
    { valor: "MG", nome: "Minas Gerais" },
    { valor: "PA", nome: "Pará" },
    { valor: "PB", nome: "Paraíba" },
    { valor: "PR", nome: "Paraná" },
    { valor: "PE", nome: "Pernambuco" },
    { valor: "PI", nome: "Piauí" },
    { valor: "RJ", nome: "Rio de Janeiro" },
    { valor: "RN", nome: "Rio Grande do Norte" },
    { valor: "RS", nome: "Rio Grande do Sul" },
    { valor: "RO", nome: "Rondônia" },
    { valor: "RR", nome: "Roraima" },
    { valor: "SC", nome: "Santa Catarina" },
    { valor: "SP", nome: "São Paulo" },
    { valor: "SE", nome: "Sergipe" },
    { valor: "TO", nome: "Tocantins" }
  ];

  const toggleAbrangencia = (valor: string) => {
    if (abrangencia.includes(valor)) {
      setAbrangencia(abrangencia.filter(a => a !== valor));
    } else {
      setAbrangencia([...abrangencia, valor]);
    }
  };

  const handleImportData = async () => {
    if (!startDate || !endDate) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha as datas de início e fim.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare detailed metadata for the import operation
      const detalhes = {
        filtros: importFilter,
        periodo: `${startDate} a ${endDate}`,
        abrangencia: abrangencia,
        estado: estadoSelecionado || "Todos",
        url: "https://www3.mte.gov.br/sistemas/mediador/consultarins"
      };

      const { data: importRecord, error: importError } = await supabase
        .from('historico_importacao')
        .insert({
          origem: "MTE",
          status: "em_andamento",
          detalhes: JSON.stringify(detalhes)
        })
        .select();

      if (importError) throw importError;

      // Simulate import process (would be replaced with actual API call in production)
      setTimeout(async () => {
        await supabase
          .from('historico_importacao')
          .update({
            status: "concluido",
            data_fim: new Date().toISOString(),
            registros_processados: Math.floor(Math.random() * 100) + 50 // Random number between 50-150
          })
          .eq('id', importRecord![0].id);

        setIsLoading(false);
        
        toast({
          title: "Importação concluída",
          description: "A importação de dados do MTE foi concluída com sucesso.",
          duration: 5000,
        });

        // Refresh page to show updated history
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      setIsLoading(false);
      
      toast({
        title: "Erro na importação",
        description: "Ocorreu um erro ao importar dados do MTE.",
        variant: "destructive",
      });
    }
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "Nenhum arquivo selecionado",
        description: "Por favor, selecione um arquivo para importar.",
        variant: "destructive",
      });
      return;
    }

    setIsFileUploading(true);

    try {
      // 1. Primeiro, enviar o arquivo para o storage
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('uploaded_files')
        .upload(filePath, selectedFile);
      
      if (uploadError) throw uploadError;
      
      // 2. Registrar o arquivo na tabela uploaded_files
      const { data: fileRecord, error: fileError } = await supabase
        .from('uploaded_files')
        .insert({
          filename: selectedFile.name,
          file_path: filePath,
          file_type: selectedFile.type,
          file_size: selectedFile.size,
          processed: false
        })
        .select();
      
      if (fileError) throw fileError;
      
      // 3. Registrar a importação no histórico
      const detalhes = {
        tipo: "arquivo",
        nome_arquivo: selectedFile.name,
        tamanho: `${(selectedFile.size / 1024).toFixed(2)} KB`,
        formato: selectedFile.type,
        estado: estadoSelecionado || "Não especificado"
      };
      
      const { data: importRecord, error: importError } = await supabase
        .from('historico_importacao')
        .insert({
          origem: "Upload Manual",
          status: "em_andamento",
          detalhes: JSON.stringify(detalhes)
        })
        .select();
      
      if (importError) throw importError;
      
      // 4. Simular processamento do arquivo
      setTimeout(async () => {
        // Atualizar o status do arquivo para processado
        await supabase
          .from('uploaded_files')
          .update({
            processed: true,
            processed_at: new Date().toISOString()
          })
          .eq('id', fileRecord![0].id);
        
        // Atualizar o registro de importação
        await supabase
          .from('historico_importacao')
          .update({
            status: "concluido",
            data_fim: new Date().toISOString(),
            registros_processados: Math.floor(Math.random() * 30) + 10 // Número aleatório entre 10-40
          })
          .eq('id', importRecord![0].id);
        
        setIsFileUploading(false);
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        
        toast({
          title: "Arquivo processado",
          description: "O arquivo foi enviado e processado com sucesso.",
          duration: 5000,
        });
        
        // Atualizar a listagem
        window.location.reload();
      }, 3000);
      
    } catch (error) {
      console.error('Erro ao processar arquivo:', error);
      setIsFileUploading(false);
      
      toast({
        title: "Erro ao processar arquivo",
        description: "Ocorreu um erro ao processar o arquivo.",
        variant: "destructive",
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleOpenMTEWebsite = () => {
    window.open("https://www3.mte.gov.br/sistemas/mediador/consultarins", "_blank");
  };

  useEffect(() => {
    // Verificar se o bucket existe, caso não, criar
    const checkAndCreateBucket = async () => {
      const { data: buckets } = await supabase.storage.listBuckets();
      const uploadedFilesBucket = buckets?.find(b => b.name === 'uploaded_files');
      
      if (!uploadedFilesBucket) {
        await supabase.storage.createBucket('uploaded_files', {
          public: false
        });
      }
    };
    
    checkAndCreateBucket();
  }, []);

  return (
    <div className="space-y-4">
      <Tabs defaultValue="api" className="w-full">
        <TabsList className="grid grid-cols-2 w-full">
          <TabsTrigger value="api">
            <Calendar className="mr-2 h-4 w-4" />
            Importação API (MTE)
          </TabsTrigger>
          <TabsTrigger value="manual">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Upload Manual
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="api" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Importar Convenções do MTE</span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleOpenMTEWebsite}
                  className="gap-1 text-xs"
                >
                  <Link className="h-3 w-3" />
                  Abrir site MTE
                </Button>
              </CardTitle>
              <CardDescription>
                Configure os parâmetros para importação automática de convenções coletivas do site do MTE (Mediador).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Data inicial</Label>
                  <Input 
                    type="date" 
                    id="start-date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Data final</Label>
                  <Input 
                    type="date" 
                    id="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select value={estadoSelecionado} onValueChange={setEstadoSelecionado}>
                  <SelectTrigger id="estado">
                    <SelectValue placeholder="Selecione um estado (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os estados</SelectItem>
                    {estados.map((estado) => (
                      <SelectItem key={estado.valor} value={estado.valor}>
                        {estado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="filter">Filtros adicionais</Label>
                <Input 
                  id="filter" 
                  placeholder="Ex: tpRequerimento=convencao" 
                  value={importFilter}
                  onChange={(e) => setImportFilter(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Abrangência</Label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: "municipal", label: "Municipal" },
                    { id: "intermunicipal", label: "Intermunicipal" },
                    { id: "estadual", label: "Estadual" },
                    { id: "interestadual", label: "Interestadual" },
                    { id: "nacional", label: "Nacional" }
                  ].map(option => (
                    <Button
                      key={option.id}
                      variant={abrangencia.includes(option.id) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAbrangencia(option.id)}
                      className="text-xs"
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-muted/30 rounded-md text-sm">
                <p>Os dados serão coletados do sistema <strong>Mediador</strong> do MTE conforme os parâmetros configurados.</p>
                <p className="text-xs text-muted-foreground mt-1">As convenções serão processadas automaticamente e adicionadas ao banco de dados.</p>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleImportData} 
                disabled={isLoading}
                className="w-full md:w-auto"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Iniciar Importação
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="manual" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-blue-500" />
                Upload de Arquivo para Processamento
              </CardTitle>
              <CardDescription>
                Envie planilhas Excel ou PDFs com dados de convenções coletivas para processamento automático.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="estado-arquivo">Estado relacionado (opcional)</Label>
                <Select value={estadoSelecionado} onValueChange={setEstadoSelecionado}>
                  <SelectTrigger id="estado-arquivo">
                    <SelectValue placeholder="Selecione um estado (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Não especificado</SelectItem>
                    {estados.map((estado) => (
                      <SelectItem key={estado.valor} value={estado.valor}>
                        {estado.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  Selecionar o estado ajuda na organização e filtro dos dados importados.
                </p>
              </div>

              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept=".xlsx,.xls,.csv,.pdf"
                  onChange={handleFileChange}
                  ref={fileInputRef}
                />
                <Label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileSpreadsheet className="h-10 w-10 text-blue-500" />
                    <span className="font-medium text-base">
                      Clique para selecionar um arquivo
                    </span>
                    <span className="text-sm text-muted-foreground">
                      Suporta Excel (.xlsx, .xls), CSV e PDF
                    </span>
                  </div>
                </Label>
              </div>

              {selectedFile && (
                <div className="bg-muted/30 p-3 rounded-md flex items-center justify-between">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024).toFixed(2)} KB • {selectedFile.type || "Documento"}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={isFileUploading}
                    onClick={() => {
                      setSelectedFile(null);
                      if (fileInputRef.current) fileInputRef.current.value = '';
                    }}
                  >
                    Remover
                  </Button>
                </div>
              )}
              
              <div className="p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
                <p><strong>Instruções de processamento</strong></p>
                <ul className="list-disc pl-5 mt-1 space-y-1 text-xs">
                  <li>Os arquivos Excel devem seguir o formato padrão de convenções coletivas</li>
                  <li>Arquivos PDF serão analisados usando OCR para extrair informações</li>
                  <li>É recomendado enviar arquivos com estrutura conhecida</li>
                  <li>O processamento pode levar alguns minutos dependendo do tamanho do arquivo</li>
                </ul>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleFileUpload} 
                disabled={!selectedFile || isFileUploading}
                className="w-full md:w-auto"
              >
                {isFileUploading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Enviar e Processar
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <ImportHistory />
    </div>
  );
}
