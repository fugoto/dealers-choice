import React from 'react'

function ListTasks(props){
    const task = props.task
    return(
        <p key={task.id} className='task-item'>
		<button className='delete' onClick={()=> props.deleteTask(task)}>DONE! GTFO</button>
		{task.name}
		</p>
    )
}

export default ListTasks
