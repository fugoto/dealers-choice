import React from 'react'

function ListTypes(props){
    const { id, typeName, tasks } = props.type
    return(
            <p className = 'type-item'>
                <button onClick={()=>props.deleteType(props.type)}>X</button>
                <a href={`#${id}`} onClick={()=> props.showTasks(props.type)} className = { props.selectedType[0] && props.selectedType[0].id === id ? "type selected" : "type" } >{typeName} ({tasks.length})</a>
            </p>
        )    
}
export default ListTypes