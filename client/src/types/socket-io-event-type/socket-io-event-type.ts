import { SocketClient } from "@/socket-io-client/socket"
import { Socket } from "socket.io-client"

interface messageSourceAndDestinationDetail {
  receiverId: string
  senderId: string
  chatRoomId: string
}
interface newImageMessageInterface extends messageSourceAndDestinationDetail {
  message: {
    imageMessageSrc: string
  }
}
interface newMessageInterface extends messageSourceAndDestinationDetail {
  message: string
}
interface newAudiomessageDetails extends messageSourceAndDestinationDetail {
  message: {
    file: Buffer
  }
}

export interface groupMessageSourceAndDestinationDetail {
  senderId: string
  chatRoomId: string
  groupDetail: {
    _id: string
  }
}
interface groupNewTextMessageInterface extends groupMessageSourceAndDestinationDetail {
  message: {
    messageContent: string
  }
}
interface groupNewAudioMessageInterface extends groupMessageSourceAndDestinationDetail {
  message: {
    file: Buffer
  }
}

export interface groupNewPollMessageInterface extends groupMessageSourceAndDestinationDetail {
  message: {
    title: string
    options: {
      title: string
    }[]
  }
}

export interface groupNewImageMessageInterface extends groupMessageSourceAndDestinationDetail {
  message: {
    filepath: string
  }
}

interface pollMessageVoteUpdateInterface extends groupMessageSourceAndDestinationDetail {
  message: {
    _id: string
    selectedOption: {
      _id: string
      currentVotingStatus: boolean
    }
  }
}

export interface deleteMessageInterface extends messageSourceAndDestinationDetail {
  message: {
    _id: string
    messageType: "textMessage" | "voiceMessage" | "imageMessage" | "pollMessage"
  }
}
export interface deleteGroupMessageInterface extends groupMessageSourceAndDestinationDetail {
  message: {
    _id: string
    messageType: "textMessage" | "voiceMessage" | "imageMessage" | "pollMessage"
  }
}

interface ClientToServerMessageEvents {
  "message:newImageMessage": (messageDetails: newImageMessageInterface) => void
  "message:newMessage": (messageDetails: newMessageInterface) => void
  "message:newAudioMessage": (messageDetails: newAudiomessageDetails) => void
  // "groupMessage:newTextMessage"

  "groupMessage:newTextMessage": (messageDetails: groupNewTextMessageInterface) => void
  "groupMessage:newAudioMessage": (messageDetails: groupNewAudioMessageInterface) => void
  "groupMessage:newPollMessage": (messageDetails: groupNewPollMessageInterface) => void
  "groupMessage:newImageMessage": (messageDetails: groupNewImageMessageInterface) => void

  "groupMessage:pollMessageVoteUpdate": (messageDetails: pollMessageVoteUpdateInterface) => void

  "message:deleteMessage": (messageDetails: deleteMessageInterface) => void
  "groupMessage:deleteMessage": (messageDetails: deleteGroupMessageInterface) => void
}
interface ServerToClientMessageEvents {
  "message:receiveMessage": (messageDetails: newMessageInterface) => void
  "message:recieveNewImageMessage": (messageDetails: newImageMessageInterface) => void

  "groupMessage:receiveTextMessage": (messageDetails: groupNewTextMessageInterface) => void
  "groupMessage:receiveAudioMessage": (messageDetails: groupNewAudioMessageInterface) => void
  "groupMessage:receivePollMessage": (messageDetails: groupNewPollMessageInterface) => void
  "groupMessage:receiveImageMessage": (messageDetails: groupNewImageMessageInterface) => void

  "message:deleteMessage": (response: deleteMessageInterface) => void
  "groupMessage:deleteMessage": () => void
}

interface groupAndSenderDetail {
  senderId: string
  chatRoomId: string
  groupDetail: {
    _id: string
  }
}
interface groupSetting {
  isAdminOnlySendMessage: boolean
  isAllowedJoinByUrl: boolean
  isHidingMembersNumber: boolean
}

interface groupUpdateSetting extends groupAndSenderDetail {
  setting: groupSetting
}
interface ClientToServerGroupHandlerEvents {
  "group:updateSetting": (args: groupUpdateSetting) => void
}
interface ServerToClientGroupHandlerEvents {
  "group:onUpdateSetting": (args: groupUpdateSetting) => void
}

export interface ClientToServerEvents extends ClientToServerMessageEvents, ClientToServerGroupHandlerEvents {}
export interface ServerToClientEvents extends ServerToClientMessageEvents, ServerToClientGroupHandlerEvents {}

export type SocketIO = SocketClient | Socket<ServerToClientEvents, ClientToServerEvents>
