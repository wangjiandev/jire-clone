import { createSessionClient } from '@/lib/appwrite'

export const getCurrent = async () => {
    try {
        const { account } = await createSessionClient()
        const user = await account.get()
        return user
    } catch (error) {
        console.error(error)
        return null
    }
}
