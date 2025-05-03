import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ThumbsUp, Calendar, Link2, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface FeedItem {
  id: string;
  type: "noticia" | "evento" | "convencao";
  source: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  title: string;
  content: string;
  imageUrl?: string;
  date: Date;
  likes?: number;
  comments?: number;
  eventDate?: Date;
  tag?: string;
  url?: string;
}

// Mock data as fallback
const mockFeedItems: FeedItem[] = [
  {
    id: "1",
    type: "noticia",
    source: {
      name: "SINDICATO DOS METALÚRGICOS",
      avatar: "https://ui-avatars.com/api/?name=SM&background=0D8ABC&color=fff",
      verified: true,
    },
    title: "Negociação Coletiva 2024: reunião define pauta dos metalúrgicos",
    content: "Foi realizada na última quarta-feira (24) a assembleia que definiu a pauta de reivindicações dos metalúrgicos para a campanha salarial deste ano. Entre os principais pontos estão reajuste acima da inflação, manutenção de benefícios e ampliação do auxílio educação.",
    imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    date: new Date(2024, 3, 24),
    likes: 45,
    comments: 8,
    tag: "Negociação",
    url: "#"
  },
  {
    id: "2",
    type: "convencao",
    source: {
      name: "SINDICATO DO COMÉRCIO",
      avatar: "https://ui-avatars.com/api/?name=SC&background=2E8B57&color=fff",
      verified: true,
    },
    title: "Nova Convenção Coletiva 2023-2024 homologada com reajuste de 6,5%",
    content: "Foi assinada ontem a nova convenção coletiva dos comerciários para o período 2023-2024. O documento prevê reajuste salarial de 6,5%, aumento do vale-alimentação e novas regras para banco de horas.",
    date: new Date(2024, 3, 15),
    tag: "Convenção",
    url: "#"
  },
  {
    id: "3",
    type: "evento",
    source: {
      name: "SINDICATO DOS PROFESSORES",
      avatar: "https://ui-avatars.com/api/?name=SP&background=8B4513&color=fff",
      verified: true,
    },
    title: "Seminário sobre novas tecnologias na educação",
    content: "O Sindicato dos Professores realizará seminário gratuito sobre o uso de tecnologias na educação. O evento ocorrerá no auditório da sede e contará com especialistas do setor educacional.",
    imageUrl: "https://images.unsplash.com/photo-1503676382389-4809596d5290?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    date: new Date(2024, 3, 10),
    eventDate: new Date(2024, 4, 15),
    tag: "Evento",
    url: "#"
  }
];

export function FeedSindicatos() {
  const [activeTab, setActiveTab] = useState<"all" | "noticias" | "eventos" | "convencoes">("all");
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadFeedData = async () => {
    setIsLoading(true);
    try {
      // Fetch real data from database
      const { data: feedData, error } = await supabase
        .from('feed_noticias')
        .select('*')
        .order('data_publicacao', { ascending: false })
        .limit(10);
      
      if (error) throw error;
      
      if (feedData && feedData.length > 0) {
        // Transform to our FeedItem format
        const transformedItems: FeedItem[] = feedData.map(item => {
          let sourceName = item.fonte || "Fonte não especificada";
          // Use simpler approach without join since relation might not exist
          if (item.sindicato_id) {
            sourceName = `Sindicato ID: ${item.sindicato_id}`;
          }
          
          return {
            id: item.id,
            type: "noticia", // Default type
            source: {
              name: sourceName,
              avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((sourceName || "FN").substring(0, 2))}&background=0D8ABC&color=fff`,
              verified: !!item.sindicato_id,
            },
            title: item.titulo,
            content: item.conteudo || "Conteúdo não disponível",
            date: new Date(item.data_publicacao),
            tag: "Notícia",
            url: item.url || "#"
          };
        });
        
        setFeedItems(transformedItems);
        setLastUpdated(new Date());
      } else {
        // Use mock data as fallback
        setFeedItems(mockFeedItems);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.error('Erro ao carregar feed:', error);
      // Use mock data as fallback in case of error
      setFeedItems(mockFeedItems);
      setLastUpdated(new Date());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadFeedData();
  }, []);

  const filteredFeed = feedItems.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "noticias" && item.type === "noticia") return true;
    if (activeTab === "eventos" && item.type === "evento") return true;
    if (activeTab === "convencoes" && item.type === "convencao") return true;
    return false;
  });

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getUpdateText = () => {
    if (!lastUpdated) return "Carregando...";
    
    const now = new Date();
    const diffMs = now.getTime() - lastUpdated.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    
    if (diffMins < 1) return "Atualizado agora";
    if (diffMins < 60) return `Atualizado há ${diffMins} min`;
    if (diffHours < 24) return `Atualizado há ${diffHours}h`;
    return `Atualizado em ${formatDate(lastUpdated)}`;
  };

  const handleRefresh = () => {
    loadFeedData();
  };

  const renderSindicatoName = (item: any) => {
    if (item.sindicato_id) {
      // Try to join on sindicato_id if sindicatos table has this data
      return item.sindicatos?.nome || "Sindicato não especificado";
    } else {
      return "Sindicato não especificado";
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white">
        <CardTitle className="flex items-center justify-between">
          <span>Feed de Atualizações</span>
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon"
              className="h-7 w-7 text-white/80 hover:text-white hover:bg-white/10"
              onClick={handleRefresh}
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span className="sr-only">Atualizar</span>
            </Button>
            <Badge variant="outline" className="text-xs font-normal bg-white/10 border-white/20 hover:bg-white/20">
              {getUpdateText()}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <div className="border-b">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <TabsList className="grid grid-cols-4 h-12">
            <TabsTrigger value="all">Todos</TabsTrigger>
            <TabsTrigger value="noticias">Notícias</TabsTrigger>
            <TabsTrigger value="eventos">Eventos</TabsTrigger>
            <TabsTrigger value="convencoes">Convenções</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <CardContent className="p-0">
        <div className="max-h-[500px] overflow-y-auto">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filteredFeed.length > 0 ? (
            filteredFeed.map(item => (
              <div key={item.id} className="p-4 border-b last:border-b-0 animate-fade-in">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10">
                    {item.source.avatar ? (
                      <AvatarImage src={item.source.avatar} alt={item.source.name} />
                    ) : null}
                    <AvatarFallback>{item.source.name.substring(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium flex items-center gap-1">
                      {renderSindicatoName(item)}
                      {item.source.verified && (
                        <span className="inline-flex items-center justify-center rounded-full bg-blue-500 h-3 w-3">
                          <span className="text-[8px] text-white">✓</span>
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(item.date)}
                      </span>
                      {item.tag && (
                        <Badge variant="secondary" className="text-[10px] h-4 px-1">
                          {item.tag}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                
                <h3 className="text-base font-medium mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{item.content}</p>
                
                {item.imageUrl && (
                  <div className="mb-3 rounded-md overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                <div className="flex justify-between items-center mt-2">
                  <div className="flex gap-3">
                    {item.type === "noticia" && (
                      <>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                          <ThumbsUp className="h-3 w-3 mr-1" />
                          {item.likes || 0}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs text-muted-foreground">
                          <MessageCircle className="h-3 w-3 mr-1" />
                          {item.comments || 0}
                        </Button>
                      </>
                    )}
                    
                    {item.type === "evento" && item.eventDate && (
                      <Badge variant="outline" className="h-8 text-xs font-normal flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(item.eventDate)}
                      </Badge>
                    )}
                  </div>
                  
                  <Button variant="link" size="sm" className="text-xs font-medium text-primary">
                    {item.type === "noticia" && "Ler mais"}
                    {item.type === "evento" && "Saiba mais"}
                    {item.type === "convencao" && "Ver convenção"}
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-8 text-center">
              <p className="text-muted-foreground">Nenhuma atualização encontrada</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
