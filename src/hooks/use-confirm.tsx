import ResponsiveModal from '@/components/ResponsiveModal'
import { Button, ButtonProps } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'

const useConfirm = (
    title: string,
    message: string,
    variant: ButtonProps['variant'] = 'default',
): [() => Promise<boolean>, () => JSX.Element] => {
    const [promise, setPromise] = useState<{ resolve: (value: boolean) => void } | null>(null)

    const confirm = () => {
        return new Promise<boolean>((resolve) => {
            setPromise({ resolve })
        })
    }

    const handleClose = () => {
        setPromise(null)
    }

    const handleConfirm = () => {
        if (promise) {
            promise.resolve(true)
            setPromise(null)
        }
    }

    const handleCancel = () => {
        if (promise) {
            promise.resolve(false)
            setPromise(null)
        }
    }

    const ConfirmationDialog = () => {
        return (
            <ResponsiveModal open={promise !== null} onOpenChange={handleClose}>
                <Card className="h-full w-full border-none shadow-none">
                    <CardContent className="pt-8">
                        <CardHeader className="p-0">
                            <CardTitle>{title}</CardTitle>
                            <CardDescription>{message}</CardDescription>
                        </CardHeader>
                        <div className="flex w-full flex-col items-center justify-end gap-x-2 gap-y-2 pt-4 lg:flex-row">
                            <Button variant="outline" onClick={handleCancel} className="w-full lg:w-auto">
                                Cancel
                            </Button>
                            <Button variant={variant} onClick={handleConfirm} className="w-full lg:w-auto">
                                Confirm
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </ResponsiveModal>
        )
    }

    return [confirm, ConfirmationDialog]
}

export default useConfirm
