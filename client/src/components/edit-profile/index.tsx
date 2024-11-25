import React, { useContext, useState } from 'react'
import { User } from '../../app/types';
import { useUpdateUserMutation } from '../../app/services/userApi';
import { ThemeContext } from '../theme-provider';
import { useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Textarea } from '@nextui-org/react';
import { Input } from '../input';
import { MdOutlineEmail } from 'react-icons/md';
import { ErrorMessage } from '../errors-message';
import { hasErrorField } from '../../utils/has-error-field';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    user?: User;

}

export const EditProfile: React.FC<Props> = ({
    isOpen,
    onClose,
    user
}) => {
    const { theme } = useContext(ThemeContext);
    const [updateUser, {isLoading}] = useUpdateUserMutation();
    const [error, setError] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { id } = useParams<{id: string}>();

    const {handleSubmit, control} = useForm<User>({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            email: user?.email,
            name: user?.name,
            dateOfBirth: user?.dateOfBirth,
            bio: user?.bio,
            location: user?.location
        }
    })

    const onSubmit = async (data: User) => {
        if(id) {
            try {
                const formData = new FormData();
                data.name && formData.append('name', data.name)
                data.email && data.email !== user?.email && formData.append('email',data.email)
                data.dateOfBirth && formData.append('dateOfBirth', new Date(data.dateOfBirth).toISOString())
                data.bio && formData.append('bio', data.bio)
                data.location && formData.append('location', data.location)
                selectedFile && formData.append('avatar', selectedFile)

                await updateUser({userData: formData, id}).unwrap();
                onClose
            } catch (error) {
                if(hasErrorField(error)) {
                    setError(error.data.error)
                }
            }
        }
    }

    

   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files !== null) {
            setSelectedFile(e.target.files[0])
        }
    }

  return (
    <Modal
    isOpen={isOpen}
    onClose={onClose}
    className={`${theme} text-foreground`}
    >
        <ModalContent>
            {
                (onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>
                            Изменение профиля
                        </ModalHeader>
                        <ModalBody>
                            <form 
                            className='flex flex-col gap-4'
                            onSubmit={handleSubmit(onSubmit)}
                            >
                                <Input 
                                    control={control}
                                    name='email'
                                    label='email'
                                    type='email'
                                endContent={<MdOutlineEmail/>}
                                />
                                <Input 
                                    control={control}
                                    name='name'
                                    label='Имя'
                                    type='text'
                                />
                                <input 
                                    type='file' 
                                    name='avatarUrl' 
                                    placeholder='Выберите файл'
                                    onChange={handleFileChange}
                                />
                                <Input 
                                    control={control}
                                    name='dateOfBirdth'
                                    label='Дата рождения'
                                    type='date'
                                />
                                <Controller 
                                    name='bio'
                                    control={control}
                                    render={({field}) => (
                                        <Textarea 
                                        {...field}
                                        rows={4}
                                        placeholder='Ваша биография'
                                        />
                                    )}
                                />
                                <Input 
                                    control={control}
                                    name='location'
                                    label='Местоположение'
                                    type='text'
                                />
                                <ErrorMessage error={error}/>
                                <div className="flex gap-2 justify-end">
                                    <Button
                                    fullWidth
                                    color='primary'
                                    type='submit'
                                    isLoading={isLoading}
                                    >
                                        Обновите профиль
                                    </Button>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                           <Button color='danger' variant='light' onPress={onClose}>
                                Закрыть
                            </Button> 
                        </ModalFooter>
                    </>
                )
            }
        </ModalContent>
    </Modal>
  )
}
