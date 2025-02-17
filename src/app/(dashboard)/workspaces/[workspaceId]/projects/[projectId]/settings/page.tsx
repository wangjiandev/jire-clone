import { getCurrent } from '@/features/auth/queries'
import EditProjectForm from '@/features/projects/components/edit-project-form'
import { getProject } from '@/features/projects/queries'
import { redirect } from 'next/navigation'
import { notFound } from 'next/navigation'

interface ProjectIdSettingsPageProps {
    params: {
        projectId: string
    }
}

const ProjectIdSettingsPage = async ({ params }: ProjectIdSettingsPageProps) => {
    const user = await getCurrent()
    if (!user) redirect('/sign-in')

    const initialValue = await getProject({ projectId: params.projectId })

    if (!initialValue) {
        notFound()
    }

    return (
        <div className="m-auto w-full lg:max-w-xl">
            <EditProjectForm initialValues={initialValue} />
        </div>
    )
}

export default ProjectIdSettingsPage
