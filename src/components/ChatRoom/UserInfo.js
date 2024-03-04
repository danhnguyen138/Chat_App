import React, { useContext } from 'react';
import { Button, Avatar, Typography } from 'antd';
import styled from 'styled-components';

import { auth, db } from '../../firebase/config';
import { AuthContext } from './../../Context/AuthProvider';
import {AppContext} from '../../Context/AppProvider';
const WrapperStyled = styled.div`
    display:flex;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid rgba(82, 38, 83);
    .username{
        color: white;
        margin-left: 5px;
    }
`
const UserInfo = () => {
    const {
        user: { displayName, photoURL }
    } = React.useContext(AuthContext);
    const {clearState}= useContext(AppContext)
    // React.useEffect(()=>{
    //     db.collection('users').onSnapshot((snapshot)=>{
    //         const data= snapshot.docs.map(doc=>({
    //             ...doc.data(),
    //             id: doc.id
    //         }))
            
    //         console.log({data, snapshot, docs: snapshot.docs})
    //     })
       
    // },[])
    return (
        <WrapperStyled>
            <div>
                <Avatar src={photoURL}>
                    {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Typography.Text className='username'>{displayName}</Typography.Text>
            </div>
            {/* đăng xuất */}
            <Button ghost
                onClick={() => {
                    // clear state in App Provider when logout
                    clearState();
                    auth.signOut();
                }}>Log out</Button>
        </WrapperStyled>
    )
}

export default UserInfo
