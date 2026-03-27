import { Button } from "@/components/ui/button"
import { columns } from "./_components/columns"
import { DataTable } from "./_components/data-table"
import { mockMedicines } from "@/lib/data"
import type { Medicine } from "@/lib/types"

async function getData(): Promise<Medicine[]> {
  // Fetch data from your API here.
  // For now, we'll use mock data.
  return mockMedicines
}

export default async function InventoryPage() {
  const data = await getData()

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Inventory</h2>
        <div className="flex items-center space-x-2">
          <Button>Add Medicine</Button>
        </div>
      </div>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
