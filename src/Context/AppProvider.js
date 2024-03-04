import React, {useState, createContext, useContext, useMemo} from 'react';
import useFirestore from '../hooks/useFirestore';
import { AuthContext } from './AuthProvider';

export const AppContext= createContext();

const AppProvider = ({children}) => {
  const [isAddRoomVisible, setIsAddRoomVisible] = useState(false); //Them Room moi
  const [isInviteMemberVisible, setIsInviteMemberVisible] = useState(false);// Moi thanh vien 
  const [selectedRoomId, setSelectedRoomId] = useState('');//Lua chon id Phong

  const {
    user:{uid}
  }= useContext(AuthContext)

  const roomsCondition= useMemo(()=>{{
    return {
      fieldName:'members',
      operator: 'array-contains',
      compareValue: uid,
    }
  }},[uid]);

  const rooms= useFirestore('rooms', roomsCondition);

  const selectedRoom= useMemo(
    ()=>rooms.find((room)=>room.id===selectedRoomId)|| {},
    [rooms, selectedRoomId]
  );

  const userCondition= useMemo(()=>{
    return {
      fieldName: 'uid',
      operator: 'in',
      compareValue: selectedRoom.members
    }
  },[selectedRoom.members]);

  const members= useFirestore('users', userCondition);

  const clearState=()=>{
    setSelectedRoomId('');
    setIsAddRoomVisible(false);
    setIsInviteMemberVisible(false);
  }
  return (
    <AppContext.Provider
      value={{
        rooms,
        members,
        selectedRoom,
        isAddRoomVisible,
        setIsAddRoomVisible,
        selectedRoomId,
        setSelectedRoomId,
        isInviteMemberVisible,
        setIsInviteMemberVisible,
        clearState,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export default AppProvider;
