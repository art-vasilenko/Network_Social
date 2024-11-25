import React from 'react'
import { useCreatePostMutation, useLazyGetAllPostQuery, useLazyGetPostByIdQuery } from '../../app/services/postsApi'
import { Controller, useForm } from 'react-hook-form';
import { Form, useParams } from 'react-router-dom';
import { Button, Textarea } from '@nextui-org/react';
import { ErrorMessage } from '../errors-message';
import { IoMdCreate } from 'react-icons/io';
import { useCreateCommentMutation } from '../../app/services/commentsApi';

export const CreateComment = () => {
    const { id } = useParams<{id: string}>();
    const [ createComment ] = useCreateCommentMutation();
    const [getPostById] = useLazyGetPostByIdQuery();

    const {
        handleSubmit,
        control,
        formState: { errors },
        setValue

     } = useForm();

     const error = errors?.post?.message as string;

     const onSubmit = handleSubmit(async (data) => {
        try {
            if(id) {
                await createComment({content: data.comment, postId: id }).unwrap();
                setValue('comment', '');
                await getPostById(id).unwrap();
            }
        } catch (error) {
            console.error(error)
        }
     })


  return (
    <Form className='flex-grow' onSubmit={onSubmit}> 
        <Controller
          name='comment'
          control={control}
          defaultValue=''
          rules={{
            required:  'Обязательное поле'
          }}
          render = {({ field }) => (
            <Textarea
                {...field}
                labelPlacement='outside'
                placeholder='Оставьте комментарий'
                className='mb-5'
            />
            )}
        />

        {errors && <ErrorMessage error={error}/>}

        <Button
        color='success'
        variant='shadow'
        className='flex-end'
        endContent={<IoMdCreate />}
        type='submit'
        >
            Ответить
        </Button>
    </Form>
  )
}
