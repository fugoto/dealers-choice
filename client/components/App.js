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
		
		const loadPage =async() => {
			const typeId = window.location.hash.slice(1) * 1
			const type = this.state.tasksByType.filter(type => type.id === typeId)[0]
			this.showTasks(type)
		}
		window.addEventListener('hashchange',async()=>{
			loadPage()
		})
		console.log(window.location.hash.slice(1))
		if (window.location.hash.slice(1)) loadPage()
		else {
			const defaultType = this.state.tasksByType.filter(type => type.id === 1)[0]
			this.showTasks(defaultType)
			}
		}
	
	async showTasks(type){
		// const selectedType = (await axios.get(`/api/types/${type.id}`)).data
		this.setState( { selectedType: [type] } )
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
			<div id='container'>
				<label>Create new task here: </label>
				<input type='text' id='new-task' placeholder='task name' 
					value={this.state.newTaskName} 
					onChange={(e) => this.setState({ newTaskName: e.target.value})}></input>
				<select 
					onChange={(e)=> this.setState({ newTaskTypeId: e.target.value})}>
					{ tasksByType.map(type => {
						return(
							<option key={type.id} value={type.id}>{type.typeName}</option>
						)
					})}
				</select>
				<button onClick={()=> this.createTask(this.state.newTaskTypeId, this.state.newTaskName)}>Create new task</button>
				<div id='list'>
				<section id='types'>
				{tasksByType.map(type => {
						return(
							<p key={type.id}>
							<a href={`#${type.id}`} className='tasks' onClick={()=> this.showTasks(type)}>{type.typeName} ({type.tasks.length})</a>
							</p>
						)
					})
				}
				</section>
				<section>
				{ selectedType.length ? 
					selectedType[0].tasks.map(task => {
						return(
							<p key={task.id}>
								<button className='delete' onClick={()=> this.deleteTask(task)}>DONE! GTFO</button>
								{task.name}
							</p>
						)}) 
					:
					null
				}
				</section>
				</div>
			</div>
		)
	}
}
