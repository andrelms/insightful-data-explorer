
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ImportHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Histórico de Importações</CardTitle>
        <CardDescription>
          Registros das importações realizadas no sistema.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Qtd. Registros</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>25/04/2023 08:30</TableCell>
              <TableCell>sistema@auto.com</TableCell>
              <TableCell>124</TableCell>
              <TableCell><Badge variant="secondary" className="bg-green-500 text-white">Concluído</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>18/04/2023 10:15</TableCell>
              <TableCell>admin@sindicato.org</TableCell>
              <TableCell>87</TableCell>
              <TableCell><Badge variant="secondary" className="bg-green-500 text-white">Concluído</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>10/04/2023 14:22</TableCell>
              <TableCell>sistema@auto.com</TableCell>
              <TableCell>56</TableCell>
              <TableCell><Badge variant="secondary" className="bg-green-500 text-white">Concluído</Badge></TableCell>
            </TableRow>
            <TableRow>
              <TableCell>02/04/2023 09:45</TableCell>
              <TableCell>admin@sindicato.org</TableCell>
              <TableCell>-</TableCell>
              <TableCell><Badge variant="destructive">Erro</Badge></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
