import React from 'react'
import ReactDOM from 'react-dom'
import axios from 'axios'
import ListTypes from './ListTypes'
import ListTasks from './ListTasks'

export default class App extends React.Component {
	constructor(){
		super()
		this.state = {
			tasksByType: [],
			selectedType: [],
			newTaskName: "",
			newTaskTypeId: 0,
			newTypeName: "",
			errorMsg: ""
		}
		this.showTasks = this.showTasks.bind(this)
		this.deleteTask = this.deleteTask.bind(this)
		this.createTask = this.createTask.bind(this)
		this.deleteType = this.deleteType.bind(this)
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
		if (window.location.hash.slice(1)) loadPage()
		else if(this.state.tasksByType.length)
			{
			const defaultType = this.state.tasksByType.filter(type => type.id === 1)[0]
			this.showTasks(defaultType)
			}
		}
	
	async showTasks(type){
		if(type){
			const selectedType = (await axios.get(`/api/types/${type.id}`)).data
		this.setState( { selectedType: selectedType } )
		}
		
	}
	async deleteTask(task){
		const updated = (await axios.delete(`/api/tasks/${task.id}`)).data
		this.setState( {tasksByType: updated} )
		this.setState( {selectedType: updated.filter(type => type.id === task.typeId)})
	}
	async createTask(typeId, taskName){
		try{
			const updated = (await axios.post(`/api/types/${parseInt(typeId)}`,
		{ name: taskName })).data
		this.setState( {tasksByType: updated } )
		this.setState( {selectedType: updated.filter(type => type.id === parseInt(typeId))})
		} 
		catch {
			this.setState( {errorMsg: 'Idiot'} )
		}
	}
	async createType(typeName){
		if(typeName) {
			const updated = (await axios.post(`/api/types/`,
		{ name: typeName })).data
		this.setState( {tasksByType: updated} )
		}
		else this.setState( { errorMsg: 'Idiot'} )
	}
	async deleteType(type){
		const updated = (await axios.delete(`/api/types/${type.id}`)).data
		this.setState( {tasksByType : updated} )
	}
	render(){
		const { tasksByType, selectedType } = this.state
		return(
			<div id='container'>
				<p className='error'>{this.state.errorMsg}</p>
				<div className = 'create'>
					<label>Create new task category here: </label>
					<input type='text' id='new-type' placeholder='task category name' 
						value={this.state.newTypeName}
						onChange={(e) => this.setState({ newTypeName: e.target.value})}></input>
					<button onClick={()=> this.createType(this.state.newTypeName)}>Create new category</button>
				</div>
				<div className = 'create'>
					<label>Create new task here: </label>
					<input type='text' id='new-task' placeholder='task name' 
						value={this.state.newTaskName} 
						onChange={(e) => this.setState({ newTaskName: e.target.value})}></input>
					<select value={this.state.newTaskTypeId}
						onChange={(e)=> this.setState({ newTaskTypeId: e.target.value})}>
							<option>Select category:</option>
						{ tasksByType.map(type => {
							return(
								<option key={type.id} value={type.id}>{type.typeName}</option>
							)
						})}
					</select>
					<button onClick={()=> this.createTask(this.state.newTaskTypeId, this.state.newTaskName)}>Create new task</button>
				</div>
				
				<div id='list'>
					<div id='types'>
						<h1 className='header'>Categories</h1>
						{tasksByType.map(type => { return(
							<ListTypes type={type} showTasks={this.showTasks} key={type.id} selectedType={this.state.selectedType} deleteType={this.deleteType}/>
							)
						})
						}
					</div>
				<div id='tasks'>
					<h1 className='header'>Tasks</h1>
					{ selectedType.length ? 
						selectedType[0].tasks.map(task => {
							return(
								<ListTasks task={task} deleteTask={this.deleteTask} key={task.id}/>
							)
						}) 
						:
						null
					}
				</div>
				</div>
			</div>
		)
	}
}
