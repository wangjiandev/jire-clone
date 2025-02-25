import { Calendar, Table, Kanban, PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'

const TaskViewSwitcher = () => {
    return (
        <Tabs className="w-full flex-1 rounded-lg border">
            <div className="flex h-full flex-col overflow-auto p-4">
                <div className="flex flex-col items-center justify-between gap-y-2 lg:flex-row">
                    <TabsList className="w-full lg:w-auto">
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
                            Table
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
                            Kanban
                        </TabsTrigger>
                        <TabsTrigger className="h-8 w-full lg:w-auto" value="calendar">
                            Calendar
                        </TabsTrigger>
                    </TabsList>
                    <Button size="sm" className="w-full lg:w-auto">
                        <PlusIcon className="size-4" />
                        New
                    </Button>
                </div>
                <Separator className="my-4" />
                {/* // TODO: Add filters */}
                data filters
                <Separator className="my-4" />
                <>
                    <TabsContent value="table">
                        <Table />
                    </TabsContent>
                    <TabsContent value="kanban">
                        <Kanban />
                    </TabsContent>
                    <TabsContent value="calendar">
                        <Calendar />
                    </TabsContent>
                </>
            </div>
        </Tabs>
    )
}

export default TaskViewSwitcher
