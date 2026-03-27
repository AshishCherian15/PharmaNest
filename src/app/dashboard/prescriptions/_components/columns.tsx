"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, ArrowUpDown, CheckCircle, XCircle, FileClock } from "lucide-react"

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
import { Prescription } from "@/lib/types"

export const columns: ColumnDef<Prescription>[] = [
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
    accessorKey: "patientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("patientName")}</div>,
  },
  {
    accessorKey: "doctorName",
    header: "Doctor Name",
  },
  {
    accessorKey: "date",
    header: "Date",
     cell: ({ row }) => {
      const date = new Date(row.getValue("date"))
      const formattedDate = date.toLocaleDateString("en-US", {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      return <div>{formattedDate}</div>
    }
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      
      let badge;
      switch(status) {
        case 'pending':
          badge = <Badge variant="outline" className="text-amber-600 border-amber-600"><FileClock className="mr-1 h-3 w-3" />Pending</Badge>;
          break;
        case 'verified':
           badge = <Badge className="bg-green-500 hover:bg-green-500/80 text-secondary-foreground"><CheckCircle className="mr-1 h-3 w-3" />Verified</Badge>;
           break;
        case 'rejected':
            badge = <Badge variant="destructive"><XCircle className="mr-1 h-3 w-3" />Rejected</Badge>;
            break;
        default:
            badge = <Badge variant="secondary">Unknown</Badge>;
      }
      return badge;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const prescription = row.original
      const { updateStatus } = table.options.meta as { updateStatus: (id: string, status: 'verified' | 'rejected') => void };

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
            {prescription.status === 'pending' && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-green-600 focus:text-green-600"
                  onSelect={() => updateStatus(prescription.id, 'verified')}
                >
                  Verify
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive"
                  onSelect={() => updateStatus(prescription.id, 'rejected')}
                >
                  Reject
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
