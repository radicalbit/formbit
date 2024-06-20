import { Message } from "@radicalbit/radicalbit-design-system"

export const success = (json: Record<string, unknown>) => {
    Message.success('Form Sent')
    console.log('Submitted Form', json)
}