import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { deleteTask, updateTask } from '../features/tasksSlice';
import TaskForm from './TaskForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskList = () => {
    const tasks = useSelector(state => state.tasks.tasks);
    const dispatch = useDispatch();
    const [selectedTask, setSelectedTask] = useState(null);
    const [isFormVisible, setFormVisible] = useState(false);
    const [search, setSearch] = useState('');

    const filteredTasks = useMemo(() => {
        return tasks.filter(task =>
            task.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [tasks, search]);

    const handleEdit = task => {
        setSelectedTask(task);
        setFormVisible(true);
    };

    const handleDelete = id => {
        dispatch(deleteTask(id));
    };

    const closeForm = () => {
        setSelectedTask(null);
        setFormVisible(false);
    };

    const handleDragEnd = (result) => {
        const { destination, source } = result;

        // Check if dropped outside the list or the same position
        if (!destination ||
            (destination.droppableId === source.droppableId && destination.index === source.index)) {
            return;
        }

        // Get the task being moved
        const taskId = filteredTasks[source.index].id;
        const newState = destination.droppableId; // New state from droppableId

        // Update the task's state in the Redux store
        dispatch(updateTask({ id: taskId, state: newState }));
    };

    return (
        <DragDropContext onDragEnd={handleDragEnd}>
            <div>
                <div class="container">
                    <div class="row d-flex justify-content-around mt-5">
                        <button class="btn btn-primary w-25" onClick={() => setFormVisible(true)}>Add Task</button>
                        {isFormVisible && <TaskForm existingTask={selectedTask} onClose={closeForm} />}

                        <input
                            type="text"
                            placeholder="Search by task name"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            class="w-50 form-control"
                        />
                    </div>
                </div>
                <div class="container-fluid mt-5">
                    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                        {['todo', 'doing', 'done'].map(state => (
                            <Droppable key={state} droppableId={state}>
                                {(provided) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        style={{ width: '30%', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}
                                    >
                                        <h2>{state.charAt(0).toUpperCase() + state.slice(1)}</h2>
                                        <ul>
                                            {filteredTasks
                                                .filter(task => task.state === state)
                                                .map((task, index) => (
                                                    <Draggable key={task.id} draggableId={task.id.toString()} index={index}>
                                                        {(provided) => (
                                                            <li

                                                                class="card mt-3" style="width: 18rem;"
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                            // style={{
                                                            //     ...provided.draggableProps.style,
                                                            //     padding: '10px',
                                                            //     margin: '5px 0',
                                                            //     background: 'white',
                                                            //     borderRadius: '4px',
                                                            //     boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                                            // }}
                                                            >

                                                                <img src={task.image} alt={task.title} style={{ width: '50px', height: '50px' , margin: 'auto'}} class = "rounded-5 " />
                                                                <div class="card-body">
                                                                    <h3>{task.title}</h3>

                                                                    <p>{task.description}</p>
                                                                    <p>Priority: {task.priority}</p>
                                                                    <p>State: {task.state}</p>

                                                                    <button class="btn btn-primary" onClick={() => handleEdit(task)}>Edit</button>
                                                                    <button class="btn btn-danger" onClick={() => handleDelete(task.id)}>Delete</button>
                                                                </div>

                                                            </li>
                                                        )}
                                                    </Draggable>
                                                ))}
                                        </ul>
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        ))}
                    </div>
                </div>
            </div>
        </DragDropContext >
    );
};

export default TaskList;
