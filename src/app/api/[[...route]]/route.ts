import { Hono } from 'hono'
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.get('/hello', (c) => {
  return c.json({ message: 'Hello World' })
})

app.get('/project/:projectId', (c) => {
  const projectId = c.req.param('projectId')
  return c.json({
    project: {
      id: projectId,
      name: 'Project 1',
      description: 'This is a project',
    },
  })
})

export const GET = handle(app)
