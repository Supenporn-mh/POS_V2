import * as React from "react"
import { ArrowUpDown, LucideSquircle, SquircleDashed } from "lucide-react"
import { cn } from "./utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table"
import { PaginationBar } from "./pagination-bar"

export interface ColumnDef<T> {
  /** Unique key — also used as the sort key when `sortable: true` */
  key: string
  /** Header label or element */
  header: React.ReactNode
  /** Cell alignment */
  align?: "left" | "center" | "right"
  /** Show sort icon and call `onSort` when the header is clicked */
  sortable?: boolean
  /** Custom cell renderer — receives the row value */
  render: (row: T) => React.ReactNode
}

interface DataTableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  /** Provide a stable unique key per row */
  rowKey: (row: T) => string
  isLoading?: boolean
  loadingMessage?: string
  emptyMessage?: string
  /** Currently active sort column key */
  sortColumn?: string
  sortDirection?: "asc" | "desc"
  onSort?: (columnKey: string) => void
  /** Total rows used by PaginationBar (pass the full sorted/filtered count) */
  totalCount: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  pageSizeOptions?: number[]
  /** Extra class on the wrapping overflow div */
  className?: string
}

export function DataTable<T>({
  columns,
  data,
  rowKey,
  isLoading = false,
  loadingMessage = "Loading...",
  emptyMessage = "No data found",
  sortColumn,
  sortDirection,
  onSort,
  totalCount,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions,
  className,
}: DataTableProps<T>) {
  return (
    <>
      <Table containerClassName="overflow-visible min-h-fit">
        <TableHeader>
          <TableRow>
            {columns.map((col) => {
              const isSorted = sortColumn === col.key
              const canSort = col.sortable && typeof onSort === "function"

              return (
                <TableHead
                  key={col.key}
                  align={col.align ?? "left"}
                  className={cn(canSort && "cursor-pointer select-none hover:bg-muted/50")}
                  onClick={canSort ? () => onSort!(col.key) : undefined}
                >
                  {canSort ? (
                    <div
                      className={cn(
                        "flex items-center gap-1",
                        col.align === "center" && "justify-center",
                        col.align === "right" && "justify-end",
                      )}
                    >
                      {col.header}
                      <ArrowUpDown
                        className={cn(
                          "h-4 w-4 shrink-0",
                          isSorted ? "text-foreground" : "text-muted-foreground/50",
                        )}
                      />
                    </div>
                  ) : (
                    col.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                align="center"
                colSpan={columns.length}
                className="py-8 text-muted-foreground disable-hover"
              >
                <div className="table-loader-wrapper">
                <span className="table-loader-spinner"></span>
                 <span className="table-loader-text">
                    {loadingMessage}
                    </span>
                </div>
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell
                align="center"
                colSpan={columns.length}
                className="py-8 text-muted-foreground disable-hover"
              >
                <div className="flex flex-col items-center gap-2">
                  <SquircleDashed className="h-8 w-8 text-muted-foreground" />
                  <span>{emptyMessage}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            data.map((row) => (
              <TableRow key={rowKey(row)}>
                {columns.map((col) => (
                  <TableCell key={col.key} align={col.align ?? "left"}>
                    {col.render(row)}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <PaginationBar
        currentPage={currentPage}
        pageSize={pageSize}
        totalCount={totalCount}
        onPageChange={onPageChange}
        onPageSizeChange={(size) => {
          onPageSizeChange(size)
          onPageChange(1)
        }}
        pageSizeOptions={pageSizeOptions}
      />
    </>
  )
}
