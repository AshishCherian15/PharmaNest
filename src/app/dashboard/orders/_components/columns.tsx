"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { PurchaseOrder } from "@/lib/types"

type TableMeta = {
  updateStatus: (id: string, status: PurchaseOrder['status']) => void;
}

export const columns: ColumnDef<PurchaseOrder>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "Order ID",
  },
  {
    accessorKey: "supplierName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Supplier
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("supplierName")}</div>,
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
     cell: ({ row }) => {
      const date = new Date(row.getValue("orderDate"))
      const formattedDate = date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
      return <div>{formattedDate}</div>
    }
  },
    {
    accessorKey: "expectedDate",
    header: "Expected Date",
     cell: ({ row }) => {
      const date = new Date(row.getValue("expectedDate"))
      const formattedDate = date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
      return <div>{formattedDate}</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      
      let variant: "default" | "secondary" | "destructive" | "outline" = "secondary";
      if (status === 'Received') variant = 'default';
      if (status === 'Shipped') variant = 'outline';
      if (status === 'Cancelled') variant = 'destructive';

      return <Badge variant={variant} className="capitalize">{status}</Badge>;
    },
  },
  {
    accessorKey: "total",
    header: () => <div className="text-right">Total</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("total"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount/100)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const order = row.original
      const { updateStatus } = table.options.meta as TableMeta;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem>View Details</DropdownMenuItem>
             <DropdownMenuSeparator />
            {order.status === 'Pending' && (
                <DropdownMenuItem onSelect={() => updateStatus(order.id, 'Shipped')}>Mark as Shipped</DropdownMenuItem>
            )}
            {order.status === 'Shipped' && (
                <DropdownMenuItem onSelect={() => updateStatus(order.id, 'Received')}>Mark as Received</DropdownMenuItem>
            )}
            {order.status !== 'Received' && order.status !== 'Cancelled' && (
                <DropdownMenuItem className="text-destructive" onSelect={() => updateStatus(order.id, 'Cancelled')}>Cancel Order</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
