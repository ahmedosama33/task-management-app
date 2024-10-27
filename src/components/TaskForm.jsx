import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { addTask, updateTask } from '../features/tasksSlice';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  description: Yup.string().required('Description is required'),
  priority: Yup.string().required('Priority is required'),
  image: Yup.string().url('Invalid URL').required('Image URL is required'),
});

const TaskForm = ({ existingTask, onClose }) => {
  const dispatch = useDispatch();
  const isEdit = !!existingTask;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: existingTask || { title: '', description: '', priority: '', image: '' },
  });

  const onSubmit = data => {
    const newData = {
      ...data,
      state: isEdit ? existingTask.state : 'todo',
      id: isEdit ? existingTask.id : Date.now(),
    };
    if (isEdit) {
      dispatch(updateTask(newData));
    } else {
      dispatch(addTask(newData));
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="col-md-12">
        <div className="row d-flex justify-content-around">
          <div className="col-6">

            <input class="form-control w-100 mt-5" type="text" {...register('title')} placeholder="Title" />
            {errors.title && <p>{errors.title.message}</p>}

            <input class="form-control w-100 mt-5" type="text" {...register('description')} placeholder="Description" />
            {errors.description && <p>{errors.description.message}</p>}

          </div>

          <div className="col-6">
            <select class="form-select w-100 mt-5" {...register('priority')}>
              <option value="">Select Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {errors.priority && <p>{errors.priority.message}</p>}

            <input class="form-control w-100 mt-5" type="url" {...register('image')} placeholder="Image URL" />
            {errors.image && <p>{errors.image.message}</p>}
          </div>
        </div>
      </div >
      <div class="d-flex justify-content-around">
        <button type="submit" class="btn btn-outline-success w-25 mt-4">{isEdit ? 'Update Task' : 'Add Task'}</button>
        <button type="button" class="btn btn-outline-danger w-25 mt-4" onClick={onClose}>Cancel</button>
      </div>
    </form >
  );
};

export default TaskForm;
