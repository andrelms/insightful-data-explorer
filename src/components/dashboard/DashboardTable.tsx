
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface TableData {
  [key: string]: string | number;
}

interface DashboardTableProps {
  data: TableData[];
  columns: string[];
}

export function DashboardTable({ data, columns }: DashboardTableProps) {
  return (
    <div className="w-full overflow-auto rounded-lg border bg-card shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column} className="bg-muted/50 font-semibold">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            data.map((row, i) => (
              <TableRow key={i} className="hover:bg-muted/30 transition-colors">
                {columns.map((column) => (
                  <TableCell key={column}>
                    {row[column]}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center py-8 text-muted-foreground">
                Nenhum dado disponível
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
