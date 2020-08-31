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
			selectedType: [],
			newTaskName: '',
			newTaskTypeId: ''
		}
		this.showTasks = this.showTasks.bind(this)
		this.deleteTask = this.deleteTask.bind(this)
	}
	async componentDidMount(){
		const tasksByType = (await axios.get('/api/types')).data
		this.setState( {tasksByType} )
	}
	async showTasks(type){
		const selectedType = (await axios.get(`/api/types/${type.id}`)).data
		this.setState( { selectedType } )
	}
	async deleteTask(task){
		const updated = (await axios.delete(`/api/tasks/${task.id}`)).data
		this.setState( {tasksByType: updated} )
		this.setState( {selectedType: updated.filter(type => type.id === task.typeId)})
	}
	async createTask(typeId, taskName){
		const updated = (await axios.post(`/api/types/${typeId}`,
		{ name: taskName })).data
		this.setState( {tasksByType: updated } )
		this.setState( {selectedType: updated.filter(type => type.id === typeId)})
	}
	render(){
		const { tasksByType, selectedType } = this.state
		return(
			<div>
				<label>Create new task here: </label>
				<input type='text' id='new-task' placeholder='task name' value={this.state.newTaskName} onChange={(e) => this.setState({ newTaskName: e.target.value})}></input>
				<select onChange={(e)=> this.setState({ newTaskTypeId: e.target.value})}>
					{ tasksByType.map(type => {
						return(
							<option key={type.id} value={type.id}>{type.typeName}</option>
						)
					})}
				</select>
				<button onClick={()=> this.createTask(this.state.newTaskTypeId, this.state.newTaskName)}>Create new task</button>
				{ selectedType.length ? 
					selectedType[0].tasks.map(task => {
						return(
							<li key={task.id}>{task.name}
								<button className='delete' onClick={()=> this.deleteTask(task)}>X</button>
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
