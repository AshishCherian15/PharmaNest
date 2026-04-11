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
import { User } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { Badge } from "@/components/ui/badge"

type TableMeta = {
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
};


export const columns: ColumnDef<User>[] = [
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
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
        const user = row.original;
        const avatar = PlaceHolderImages.find(p => p.id === user.avatarId);
        const initials = user.name.split(' ').map(n => n[0]).join('');
        return (
            <div className="flex items-center gap-3">
                <Avatar>
                    <AvatarImage src={avatar?.imageUrl} alt={user.name} data-ai-hint={avatar?.imageHint} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="font-medium">{user.name}</div>
            </div>
        )
    }
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
        const role = row.getValue("role") as string;
        const variant = role === 'Admin' ? 'destructive' : role === 'Pharmacist' ? 'default' : 'secondary';
        return <Badge variant={variant}>{role}</Badge>
    }
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "totalSpent",
    header: () => <div className="text-right">Total Spent</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalSpent"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const user = row.original
      const { onEdit, onDelete } = table.options.meta as TableMeta;

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
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(user.id)}
            >
              Copy user ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(user)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive" onClick={() => onDelete(user.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
