export interface User{
    id: string
    name: string
    email: string
}

export interface Action{
    type: "HTTR_REQUEST" | "DISCORD_WEBHOOK" | "DELAY"
    config: Record<string, any>
}

export interface Workflow{
    _id: string
    name: string
    trigger: {
        type: "WEBHOOK"
        webhookPath: string
    }
    actions: Action[]
    isActive: boolean
    createdAt: string
}

export interface Execution{
    _id: string
    workflowId: string
    status: "running" | "success" | "failed"
    startedAt: string
    completedAt: string
    logs: string[]
    outputs: Record<string, any>[]
}