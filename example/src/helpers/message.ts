import { Message } from "rbit-design-system-os"

export const success = (json: Record<string, unknown>) => {
    Message.success('Form Sent')
    console.log('Submitted Form', json)
}