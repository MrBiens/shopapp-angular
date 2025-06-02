export interface NotificationAllResponse{
    "authorName": string,
    "title": string,
    "content": string,
    "type": string,
    "image": string | null,
    "createAt": string | null,
    "read": boolean
}
