import { UserAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Tooltip, Form, Input, Alert } from 'antd';
import React, { useContext, useState, useRef, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import Message from './Message';

import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';
import useFirestore from '../../hooks/useFirestore';

const HeaderStyled = styled.div`
display: flex;
justify-content: space-between;
height: 56px;
padding: 0 16px;
align-items: center;
border-bottom: 1px solid rgb(230,230, 230);
  .header{
    &__info{
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    &__title{
      margin: 0;
      font-weight: bold;
    }
    &__description{
      font-size: 12px;
    }
  }
`;
const ButtonGroupStyled = styled.div`
  display:flex;
  align-items: center;
`;
const WrapperStyled = styled.div`
  height: 100vh;
`
const ContentStyled = styled.div`
  height: calc(100% - 100px);
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;
const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;
  height: 100px;
  .ant-form-item{
    flex: 1;
    margin-bottom: 0;
  }
  .ant-btn-primary{
    height: 100%;
  }
`
const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`


const ChatWindow = () => {
  const { selectedRoom, members, setIsInviteMemberVisible } = useContext(AppContext);
  const {
    user: { uid, photoURL, displayName }
  } = useContext(AuthContext);
  const [inputValue, setInputValue] = useState('');
  const [form] = Form.useForm();
  const inputRef = useRef(null);
  const messageListRef = useRef(null);

  const handleInputChange=(e)=>{
    setInputValue(e.target.value)
  }
  const handleOnSubmit = () => {
    addDocument('messages', {
      text: inputValue,
      uid,
      photoURL,
      roomId: selectedRoom.id,
      displayName
    });
    form.resetFields(['message']);
    // focus to input again after submit
    if (inputRef?.current) {
      setTimeout(() => {
        inputRef.current.focus();
      });
    }

  };

  const condition = useMemo(
    () => {
      return (
        {
          fieldName: 'roomId',
          operator: '==',
          compareValue: selectedRoom.id
        }
      )
    }, [selectedRoom.id]
  )

  const messages = useFirestore('messages', condition);

  useEffect(
    () => {
      if (messageListRef?.current) {
        messageListRef.current.scrollTop =
          messageListRef.current.scrollHeight + 50;
      }
    }, [messages]
  )
  return (
    <WrapperStyled>
      {selectedRoom.id ? (
        <>
          <HeaderStyled>
            <div className='header__info'>
              <p className='header__title'>
                {selectedRoom.name}
              </p>
              <span className='header__description'>
                {selectedRoom.description}
              </span>
            </div>
            <ButtonGroupStyled>
              <Button 
                icon={<UserAddOutlined />}
                type='text'
                onClick={()=>setIsInviteMemberVisible(true)}
              >
                Add
              </Button>
              <Avatar.Group size='small' maxCount={2}>
                {members.map((member)=>{
                  return (
                    <Tooltip
                      title={member.displayName}
                      key={member.id}
                    >
                      <Avatar
                        src={member.photoURL}
                      >
                        {member.photoURL?'': member.displayName?.charAt(0)?.toUpperCase()}
                      </Avatar>
                    </Tooltip>
                  )
                })}
              </Avatar.Group>
            </ButtonGroupStyled>
          </HeaderStyled>
          <ContentStyled>
            <MessageListStyled ref={messageListRef}>
             {
              messages.map(
                (mes)=>{
                  return (
                    <Message 
                      key={mes.id}
                      text={mes.text}
                      photoURL={mes.photoURL}
                      displayName={mes.displayName}
                      createAt={mes.createAt}
                    />
                  )
                }
              )
             }
            </MessageListStyled>
            <FormStyled form={form}>
              <Form.Item name='message'>
                <Input 
                  ref={inputRef}
                  onChange={handleInputChange}
                  onPressEnter={handleOnSubmit}
                  placeholder='Nhập tin nhắn...'
                  bordered={false}
                  autoComplete='off'
                  name='message'
                />
              </Form.Item>
              <Button
                type='primary'
                onClick={handleOnSubmit}
              >Send</Button>
            </FormStyled>
          </ContentStyled>
        </>
      ):(
        <Alert 
          message='Hãy chọn phòng'
          type='info'
          showIcon
          style={{
            margin: 5
          }}
          closable
        />
      )}

    </WrapperStyled>
  )
}

export default ChatWindow
