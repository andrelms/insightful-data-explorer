
import { supabase } from "@/integrations/supabase/client";

// Function to log system events
export async function addSystemLog(
  level: "INFO" | "WARN" | "ERROR", 
  message: string, 
  module: string
) {
  try {
    await supabase.from('system_logs').insert({
      level,
      message,
      module
    });
  } catch (error) {
    console.error('Erro ao registrar log:', error);
  }
}
