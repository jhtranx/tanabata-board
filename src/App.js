/* src/App.js */
import React, { useEffect, useState } from 'react'
import Amplify, { API, graphqlOperation } from 'aws-amplify'
import { createTodo } from './graphql/mutations'
import { listTodos } from './graphql/queries'
import ReactTooltip from 'react-tooltip';

import awsExports from "./aws-exports";
Amplify.configure(awsExports);

const initialState = { name: '', description: '' }

const App = () => {
  const [formState, setFormState] = useState(initialState)
  const [todos, setTodos] = useState([])

  useEffect(() => {
    fetchTodos()
  }, [])

  function setInput(key, value) {
    setFormState({ ...formState, [key]: value })
  }

  async function fetchTodos() {
    try {
      const todoData = await API.graphql(graphqlOperation(listTodos))
      const todos = todoData.data.listTodos.items
      setTodos(todos)
    } catch (err) { console.log('error fetching todos') }
  }

  async function addTodo() {
    try {
      if (!formState.name || !formState.description) return
      const todo = { ...formState }
      setTodos([...todos, todo])
      setFormState(initialState)
      await API.graphql(graphqlOperation(createTodo, {input: todo}))
    } catch (err) {
      console.log('error creating todo:', err)
    }
  }

  return (
    <div style={styles.container}>
      <h2 data-tip data-for='global' href='https://en.wikipedia.org/wiki/Tanabata#Customs'>tanabata board</h2>
      <ReactTooltip id='global' aria-haspopup='true' place="bottom" type="dark" effect="solid">
        <p>"People generally celebrate the Tanabata festival</p> 
        <p>by writing wishes, sometimes in the form of poetry,</p>
        <p>on tanzaku (短冊, tanzaku), small pieces of paper,</p>
        <p>and hanging them on bamboo" (Wikipedia)</p>
      </ReactTooltip>

      <p>make a wish! (or write wtv, im not forcing you to do anything)</p>
      <p>its like writing with permanent marker on this page</p>
      <input
        onChange={event => setInput('name', event.target.value)}
        style={styles.input}
        value={formState.name} 
        placeholder="title"
      />
      <input
        onChange={event => setInput('description', event.target.value)}
        style={styles.input}
        value={formState.description}
        placeholder="description"
      />
      <button style={styles.button} onClick={addTodo}>wish!</button>
      {
        todos.map((todo, index) => (
          <div key={todo.id ? todo.id : index} style={{backgroundColor: randomColor(50), marginTop: 100, marginBottom: 100}}>
            <a style={styles.todoName}>{todo.name}</a>
            <a style={styles.todoDescription}>{todo.description}</a>
          </div>
        ))
      }
    </div>
  )
}

function randomColor(brightness){
  function randomChannel(brightness){
    var r = 255-brightness;
    var n = 0|((Math.random() * r) + brightness);
    var s = n.toString(16);
    return (s.length==1) ? '0'+s : s;
  }
  return '#' + randomChannel(brightness) + randomChannel(brightness) + randomChannel(brightness);
}

const styles = {
  container: { width: 400, margin: '0 auto', display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', padding: 20 },
  input: { fontFamily: 'Space Mono', border: 'none', backgroundColor: '#ddd', marginBottom: 10, padding: 8, fontSize: 18 },
  todoName: { marginLeft: 15, height: 100, fontSize: 20, fontWeight: 'bold', },
  todoDescription: { height: 200,},
  button: { fontFamily: 'Space Mono', backgroundColor: 'black', color: 'white', outline: 'none', fontSize: 18, padding: '12px 0px' }
}

export default App
