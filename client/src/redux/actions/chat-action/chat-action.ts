import { axiosChatInstance, axiosUserInstance } from "@/constants/axios"
import {
  chatUserListAction,
  currentChaterAction,
  currentChaterReducerSlate,
} from "@/redux/reducers/chat-user-reducer/chat-user-reducer"
import {
  chatRoomMessageAction,
  messageAvailableChatRoomsAction,
} from "@/redux/reducers/message-reducer/message-reducer"
import { AppDispatch } from "@/store"
import { Socket } from "socket.io-client"

export const addAllChatUsers = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await axiosUserInstance.post("/getAllChatUsers")
    dispatch(chatUserListAction.addIntialAllUserList(data))
  } catch (error) {}
}

export const updateCurrentChaterHandler = (details: currentChaterReducerSlate) => async (dispatch: AppDispatch) => {
  dispatch(currentChaterAction.updateCurrentChater(details))
}

export const sendMessageHandler =
  (
    {
      message,
      receiverId,
      senderId,
      chatRoomId,
    }: { message: string; receiverId: string; senderId: string; chatRoomId: string },
    socket: Socket,
  ) =>
  async (dispatch: AppDispatch) => {
    socket.emit("message:newMessage", { message, receiverId, senderId, chatRoomId })
    dispatch(
      chatRoomMessageAction.addSendedChatRoomMessage({
        chatRoomId,
        newMessage: {
          messegeChannelType: "outgoingMessage",
          messageData: {
            chatRoomId,
            message,
            messageType: "textMessage",
            messageSendedTime: new Date(),
            postedByUser: "irfan",
          },
        },
      }),
    )
  }

export const getChatRoomMessageHandler =
  ({ chatRoomId, myUserId }: { chatRoomId: string; myUserId: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const { data } = await axiosChatInstance.post("/getChatRoomMessage", { chatRoomId })
      if (data == undefined) return dispatch(chatRoomMessageAction.removeCurrentChaterMessage({}))

      const newData = data[0].messages.map((elm) => {
        const messegeChannelType = elm.postedByUser == myUserId ? "outgoingMessage" : "incomingMessage"
        return { messageData: { ...elm, messageSendedTime: new Date(elm.createdAt) }, messegeChannelType }
      })
      console.log("data message", data)
      dispatch(chatRoomMessageAction.addIntialChatRoomMessage({ chatRoomId, messages: newData }))
      dispatch(messageAvailableChatRoomsAction.addMessageAvailableChatRooms({ chatRoomId }))
    } catch (error) {
      console.log(error)
      return dispatch(chatRoomMessageAction.removeCurrentChaterMessage({}))
    }
  }

export const receiveMessageHandler =
  ({ chatRoomId, message }: { chatRoomId: string, message: string }) =>
  async (dispatch: AppDispatch) => {
    dispatch(
      chatRoomMessageAction.addSendedChatRoomMessage({
        chatRoomId,
        newMessage: {
          messegeChannelType: "incomingMessage",
          messageData: {
            chatRoomId,
            message,
            messageType: "textMessage",
            messageSendedTime: new Date(),
            postedByUser: "irfan",
          },
        },
      }),
    )
  }

export const addNewMessageNotificationHandler = ({_id}:{_id:string}) => async (dispatch: AppDispatch) => {
  dispatch(
    chatUserListAction.addUserNotification({
      _id,
      notification: { notificationType: "newMessage", totalNotificationCount: 1, isAvailableNewNotification: true },
    }),
  )
}

export const getIntialOnlineChatUsers = (socket: Socket) => async (dispatch: AppDispatch) => {
  try {
    socket.emit("status:getOnlineUsers", (onlineUsers) => {
      dispatch(chatUserListAction.addintialOnlineUsers({ onlineUsers }))
    })
  } catch (error) {}
}
