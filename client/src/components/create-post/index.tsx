import React from 'react'
import { useCreatePostMutation, useLazyGetAllPostQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form';
import { Form } from 'react-router-dom';
import { Button, Textarea } from '@nextui-org/react';
import { ErrorMessage } from '../errors-message';
import { IoMdCreate } from 'react-icons/io';

export const CreatePost = () => {
    const [ createPost ] = useCreatePostMutation();
    const [triggerAllPosts] = useLazyGetAllPostQuery();

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue

     } = useForm();

     const error = errors?.post?.message as string;

     const onSubmit = handleSubmit(async (data) => {
        try {
            await createPost({content: data.post }).unwrap();
            setValue('post', '');
            await triggerAllPosts().unwrap();
        } catch (error) {
            console.error(error)
        }
     })


  return (
    <Form className='flex-grow' onSubmit={onSubmit}> 
        <Controller
          name='post'
          control={control}
          defaultValue=''
          rules={{
            required:  'Обязательное поле'
          }}
          render = {({ field }) => (
            <Textarea
                {...field}
                labelPlacement='outside'
                placeholder='Что нового?'
                className='mb-5'
            />
            )}
        />

        {errors && <ErrorMessage error={error}/>}

        <Button
        color='warning'
        variant='shadow'
        className='flex-end'
        endContent={<IoMdCreate />}
        type='submit'
        >
            Создать пост
        </Button>
    </Form>
  )
}
