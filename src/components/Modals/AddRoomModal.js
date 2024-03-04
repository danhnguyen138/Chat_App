import React, { useContext } from 'react'
import { Form, Modal, Input } from 'antd';
import { AppContext } from '../../Context/AppProvider';
import { addDocument } from '../../firebase/services';
import { AuthContext } from '../../Context/AuthProvider';

const AddRoomModal = () => {
    const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
    const {
        user: { uid }
    } = useContext(AuthContext);
    const [form] = Form.useForm();

    const handleOk = () => {
        //hanlde login
        //add new room to firebase
        addDocument('rooms', { ...form.getFieldValue(), members: [uid] });

        //reset form value
        form.resetFields();

        setIsAddRoomVisible(false);
    }

    const handleCancel = () => {
        form.resetFields();

        setIsAddRoomVisible(false);
    };
    return (
        <div>
            <Modal
                title='Create Room'
                visible={isAddRoomVisible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label='Room name' name='name'>
                        <Input placeholder='Input name room' />
                    </Form.Item>
                    <Form.Item label='Detail' name='description'>
                        <Input placeholder='Input detail' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AddRoomModal
