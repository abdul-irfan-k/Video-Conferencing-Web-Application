import { changeMessengerSort, messengerSortState } from "@/redux/reducers/messenger-reducer/messenger-reducer";
import { AppDispatch } from "@/store";

export const changeMessengerSortState = (data:messengerSortState) => (dispatch:AppDispatch) => {
    dispatch(changeMessengerSort(data))
}