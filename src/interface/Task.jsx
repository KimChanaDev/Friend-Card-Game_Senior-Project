import React, { useEffect, useState } from 'react'
import axios from 'axios'

function Task({ token }) {
    const [tasks, setTasks] = useState([])
    const fetchData = async (token) => {
        console.log(token)
        const response = await axios.get('http://localhost:3000/users/tasks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        setTasks(response.data.tasks)
        console.log(response.data)
    }
    useEffect(() => {
        if (token) {
            fetchData(token)
        }
    }, [])

    useEffect(() => {
        console.log(tasks)
    }, [tasks])

    return (
        <div>
            {tasks.length > 0 ? (
                tasks.map((task, index) => (
                    <p key={index}>
                      {task.title}
                    </p>
                  ))
            ) : (
                <p>tasks is null</p>
            )}
        </div>
    )
}

export default Task