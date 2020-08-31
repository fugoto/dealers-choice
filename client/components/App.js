import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
//import any sub-components

export default class App extends React.Component {
	constructor(){
		super()
		this.state = {
			types: [],
			tasks: [],
			tasksByType: [],
			selectedType: []
		}
		this.showTasks = this.showTasks.bind(this)
	}
	async componentDidMount(){
		const tasksByType = (await axios.get('/api/types')).data
		this.setState( {tasksByType} )
	
	}
	async showTasks(type){
		const selectedType = (await axios.get(`/api/types/${type.id}`)).data
		this.setState( { selectedType })
	}
	async deleteTask(task){
		const updated = (await axios.delete(`/api/tasks/${task.id}`)).data
		this.setState( {tasks: updated} )
	}

	render(){
		const { tasksByType, selectedType } = this.state
		return(
			<div>
				{ selectedType.length ? 
					selectedType[0].tasks.map(task => {
						return(
							<li key={task.id}>{task.name}
								<button className='delete'>X</button>
							</li>
							
						)}) 
					:
					tasksByType.map(type => {
						return(
							<h3 id={type.id} key={type.id} className='tasks' onClick={()=> this.showTasks(type)}>{type.typeName} ({type.tasks.length})</h3>
						)
					})
				}
			</div>
		)
	}
}
