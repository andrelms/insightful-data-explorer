
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export function ConfirmDialog({ open, onOpenChange, onConfirm, isLoading }: ConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar limpeza da base de dados</DialogTitle>
          <DialogDescription>
            Esta ação irá remover todos os dados do sistema, incluindo o histórico de consultas. Esta ação não pode ser desfeita.
            Tem certeza que deseja continuar?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={isLoading}>
            {isLoading ? "Limpando..." : "Sim, limpar tudo"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
