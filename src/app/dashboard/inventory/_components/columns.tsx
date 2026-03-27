"use client"

import Image from "next/image"
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
import { Medicine } from "@/lib/types"
import { PlaceHolderImages } from "@/lib/placeholder-images"

export const columns: ColumnDef<Medicine>[] = [
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
    id: "image",
    header: "Image",
    cell: ({ row }) => {
        const medicine = row.original;
        const image = PlaceHolderImages.find(img => img.id === medicine.imageId);
        return (
            <div className="w-10 h-10 relative">
                {image && <Image src={image.imageUrl} alt={medicine.name} width={40} height={40} className="rounded-md object-cover" data-ai-hint={image.imageHint} />}
            </div>
        )
    },
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
    {
    accessorKey: "genericName",
    header: "Generic Name",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"))
      const formatted = new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
      }).format(amount / 100)

      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "quantity",
    header: () => <div className="text-right">Quantity</div>,
    cell: ({ row }) => {
        const quantity = parseInt(row.getValue("quantity"))
        return <div className="text-right">{quantity}</div>
    }
  },
  {
    accessorKey: "expiryDate",
    header: "Expiry Date",
     cell: ({ row }) => {
      const date = new Date(row.getValue("expiryDate"))
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
      const quantity = row.original.quantity;
      const expiryDate = new Date(row.original.expiryDate);
      const now = new Date();
      const sixtyDaysFromNow = new Date();
      sixtyDaysFromNow.setDate(now.getDate() + 60);

      if (expiryDate < now) {
        return <Badge variant="destructive">Expired</Badge>;
      }
      if (quantity === 0) {
        return <Badge variant="destructive">Out of Stock</Badge>;
      }
      if (quantity < 10) {
        return <Badge className="bg-yellow-500 hover:bg-yellow-500/80 text-secondary-foreground">Low Stock</Badge>;
      }
      if (expiryDate < sixtyDaysFromNow) {
        return <Badge className="bg-orange-500 hover:bg-orange-500/80 text-secondary-foreground">Expires Soon</Badge>;
      }
      return <Badge className="bg-green-500 hover:bg-green-500/80 text-secondary-foreground">In Stock</Badge>;
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const medicine = row.original
      const { onEdit } = table.options.meta as { onEdit: (medicine: Medicine) => void };

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
              onClick={() => navigator.clipboard.writeText(medicine.id)}
            >
              Copy medicine ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem onSelect={() => onEdit(medicine)}>Edit</DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
