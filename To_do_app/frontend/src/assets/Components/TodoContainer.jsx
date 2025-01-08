import React, { useEffect, useState } from 'react';
import Navbar from "./Navbar";
import axios from "axios";

export const TodoContainer = () => {
    const [todo, setTodo] = useState("");
    const [todos, setTodos] = useState([]);
    const [editingIndex, setEditingIndex] = useState(""); // Track editing index

    // Fetch Todos from Backend
    useEffect(() => {
        axios.get('http://localhost:8080/todos')
            .then(response => setTodos(response.data))
            .catch(error => console.error('Error fetching todos:', error));
    }, []);

    // Add or Edit Todo
    const handelAdd = async () => {
        if (todo.trim() === "") {
            alert("Please enter a valid task!");
            return;
        }

        try {
            if (editingIndex !== "") {
                // Update an existing task
                const taskId = todos[editingIndex]._id;
                await axios.put(`http://localhost:8080/todo/${taskId}`, { task: todo });

                const updatedTodos = todos.map((t, i) =>
                    i === editingIndex ? { ...t, task: todo } : t
                );
                setTodos(updatedTodos);
                setEditingIndex(""); // Reset editing state
            } else {
                // Add a new task
                const response = await axios.post('http://localhost:8080/todo', { task: todo });
                setTodos([...todos, response.data]);
            }

            setTodo(""); // Clear input field
        } catch (error) {
            console.error('Error adding/updating todo:', error);
        }
    };

    // Edit a Todo
    const handelEdit = (index) => {
        const reqTodo = todos[index];

        if (!reqTodo || !reqTodo.task) {
            console.warn("No task found for editing at index:", index);
            return;
        }

        setTodo(reqTodo.task);
        setEditingIndex(index);      
    };

    // Mark a Todo as Complete/Incomplete
    const handelComplete = async (index) => {
        const taskId = todos[index]._id;
        const updatedTodo = { ...todos[index], isCompleted: !todos[index].isCompleted };

        try {
            await axios.put(`http://localhost:8080/todo/${taskId}`, updatedTodo);

            const updatedTodos = todos.map((t, i) =>
                i === index ? updatedTodo : t
            );
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error updating completion status:', error);
        }
    };

    // Delete a Todo
    const handelDelete = async (index) => {
        const taskId = todos[index]._id;
        try {
            await axios.delete(`http://localhost:8080/todo/${taskId}`);
            const updatedTodos = todos.filter((_, i) => i !== index);
            setTodos(updatedTodos);
        } catch (error) {
            console.error('Error deleting todo:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="w-full h-screen flex justify-center items-center overflow-hidden bg-gray-100">
                <div className="todoDash w-full md:w-3/4 lg:w-1/2 xl:w-1/3 bg-white text-gray-800 font-medium rounded-2xl shadow-lg p-6 flex flex-col items-center">

                    {/* Header */}
                    <div className="todoTop text-4xl font-bold text-center mb-4">TODO App</div>
                    <hr className="w-full border-t-2 border-gray-300 mb-4" />

                    {/* Body */}
                    <div className="todoBody w-full">
                        <h2 className="text-xl font-semibold mb-2">Add to TODO</h2>

                        <div className="flex gap-2 mb-4">
                            <input
                                value={todo}
                                onChange={(e) => { setTodo(e.target.value); }}
                                className="flex-1 bg-gray-100 rounded-lg p-3 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 placeholder-gray-400 transition duration-300 ease-in-out"
                                type="text"
                                placeholder="Enter your task here"
                            />

                            <button
                                onClick={handelAdd}
                                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition duration-300"
                            >
                                {editingIndex !== "" ? "Update" : "Save"}
                            </button>
                        </div>

                        {/* Todos List */}
                        <div className='w-full flex justify-between items-center mb-4'>
                            <h2 className='text-2xl font-bold text-gray-800'>Your Todos</h2>
                        </div>

                        {/* Todo List Container */}
                        <div className="todos mt-4 w-full h-60 overflow-y-auto border border-gray-300 rounded-lg p-4 bg-gray-50 shadow-inner">
                            {todos.map((todo, index) => (
                                <div
                                    key={todo._id}
                                    className="todo flex justify-between items-center p-2 mb-2 bg-white rounded-md border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300"
                                >
                                    <input
                                        type="checkbox"
                                        checked={todo.isCompleted}
                                        onChange={() => handelComplete(index)}
                                        className='mr-2 cursor-pointer'
                                    />

                                    <p className={`text-gray-700 ${todo.isCompleted ? 'line-through' : ''}`}>
                                        {todo.task}
                                    </p>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handelEdit(index)}
                                            className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-200"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handelDelete(index)}
                                            className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
