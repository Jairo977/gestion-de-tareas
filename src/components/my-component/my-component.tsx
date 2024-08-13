import { Component, State, h } from '@stencil/core';

@Component({
  tag: 'my-component',
  styleUrl: 'my-component.css',
  shadow: true,
})

export class MyComponent {
  @State() tasks: Array<{ id: number, titulo: string, descripcion: string }> = [];
  @State() newTitulo: string = '';
  @State() newDescripcion: string = '';
  @State() editingTaskId: number | null = null;

  async componentDidLoad() {
    await this.fetchTasks();
  }

  async fetchTasks() {
    try {
      const response = await fetch('http://localhost:3001/tasks');
      const data = await response.json();
      this.tasks = data;
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  }

  async handleCreateTask(e: Event) {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: this.newTitulo,
          descripcion: this.newDescripcion,
        }),
      });

      if (response.ok) {
        await this.fetchTasks(); // Refresca la lista de tareas después de crear una nueva
        this.newTitulo = '';
        this.newDescripcion = '';
      }
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  async handleDeleteTask(id: number) {
    try {
      const response = await fetch(`http://localhost:3001/tasks/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await this.fetchTasks(); // Refresca la lista de tareas después de eliminar una tarea
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  }

  async handleEditTask(id: number) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      this.newTitulo = task.titulo;
      this.newDescripcion = task.descripcion;
      this.editingTaskId = id;
    }
  }

  async handleUpdateTask(e: Event) {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/tasks/${this.editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          titulo: this.newTitulo,
          descripcion: this.newDescripcion,
        }),
      });

      if (response.ok) {
        await this.fetchTasks(); // Refresca la lista de tareas después de actualizar
        this.newTitulo = '';
        this.newDescripcion = '';
        this.editingTaskId = null;
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  }

  render() {
    return (
      <div class="container">
        <h1>Gestion de Tareas</h1>

        {/* Formulario para crear o actualizar una tarea */}
        <form onSubmit={(e) => this.editingTaskId ? this.handleUpdateTask(e) : this.handleCreateTask(e)} class="task-form">
          <input
            type="text"
            placeholder="Título de la tarea"
            value={this.newTitulo}
            onInput={(e: any) => (this.newTitulo = e.target.value)}
            required
          />
          <textarea
            placeholder="Descripción de la tarea"
            value={this.newDescripcion}
            onInput={(e: any) => (this.newDescripcion = e.target.value)}
            required
          ></textarea>
          <button type="submit" class="submit-button">{this.editingTaskId ? 'Actualizar Tarea' : 'Crear Tarea'}</button>
        </form>

        <ul class="task-list">
          {this.tasks.map(task => (
            <li key={task.id} class="task-item">
              <div class="task-content">
                <h2>{task.titulo}</h2>
                <p>{task.descripcion}</p>
              </div>
              <div class="task-actions">
                <button onClick={() => this.handleEditTask(task.id)} class="edit-button">Editar</button>
                <button onClick={() => this.handleDeleteTask(task.id)} class="delete-button">Eliminar</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
