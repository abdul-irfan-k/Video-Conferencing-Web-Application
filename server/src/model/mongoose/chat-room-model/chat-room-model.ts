import { Model, Schema, model } from "mongoose"

interface chatRoomSchemaInterface {
  UserIds: string[]
  chatRoomConversations: chatRoomConversationsInterface
}

interface chatRoomConversationsInterface {
  messageId: Schema.Types.ObjectId
  messageType: string
}

const chatRoomConversationsSchema = new Schema({
  messageId: Schema.Types.ObjectId,
  messageType: String,
})

const chatRoomSchema = new Schema(
  {
    userIds: { type: [String] },
    chatRoomConversations: {
      type: [chatRoomConversationsSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  },
)

interface staticInterface extends Model<ChatRoomDocument> {
  initiateChat(userIds: string[]): void
  addChatConversation(details: addChatConversation): void
}

chatRoomSchema.statics.initiateChat = async function (userIds: string[]) {
  try {
    const avilableRoom = await this.findOne({ userIds: { $all: userIds } })
    if (avilableRoom != null) return

    const newRoom = new this({ userIds: userIds })
    await newRoom.save()
    return { new: true }
  } catch (error) {
    console.log(error)
  }
}

interface addChatConversation {
  messageId: string
  messageType: "textMessage" | "voiceMessage"|"imageMessage"
  chatRoomId: string
}
chatRoomSchema.statics.addChatConversation = async function ({
  messageId,
  messageType,
  chatRoomId,
}: addChatConversation) {
  try {
    await this.findOneAndUpdate({ _id: chatRoomId }, { $push: { chatRoomConversations: { messageId, messageType } } })
    return
  } catch (error) {
    console.log(error)
  }
}

export interface ChatRoomDocument extends chatRoomSchemaInterface, Document {}
const ChatRoomModel = model<ChatRoomDocument, staticInterface>("ChatRoom", chatRoomSchema)
export default ChatRoomModel
