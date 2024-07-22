import { useState, useEffect } from "react";
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [updateTask, setUpdateTask] = useState({ id: null, text: "" });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/tasks");
    const data = await res.json();
    setTasks(data);
  };

  // Fonction pour ajouter une nouvelle tâche
  const addTask = async () => {
    if (newTask.trim() === "") return; // Vérification que la nouvelle tâche n'est pas vide
    const res = await fetch("/api/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: newTask, status: "pending" }), // Envoi de la nouvelle tâche au serveur
    });
    if (res.ok) {
      setNewTask(""); // Réinitialisation du champ de saisie
      fetchTasks(); // Récupération des tâches mises à jour
    }
  };

  // Fonction pour mettre à jour une tâche existante
  const editTask = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: updateTask.text }), // Envoi des nouvelles données de la tâche au serveur
    });
    if (res.ok) {
      setUpdateTask({ id: null, text: "" }); // Réinitialisation de l'état de mise à jour
      fetchTasks(); // Récupération des tâches mises à jour
    }
  };

  // Fonction pour supprimer une tâche
  const deleteTask = async (id) => {
    const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    if (res.ok) {
      fetchTasks(); // Récupération des tâches mises à jour
    }
  };

  const renderTasks = () => {
    return tasks.map((task) => (
      <li key={task._id} className="flex justify-between items-center p-2 border-b border-gray-200">
        <span>{task.text}, status : {task.status}</span>
        <div>
          <button
            className="  px-2 py-1 rounded mr-2 "
            onClick={() => setUpdateTask({ id: task._id, text: task.text })}
          >
            Edit
          </button>
          <button
            className=" px-2 py-1 rounded "
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </div>
      </li>
    ));
  };

  return (
    <main className="container  mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 ">Todo List</h1>
      <div className="mb-4 m-4">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="New task"
          className="border rounded p-2 w-full"
        />
        <button
          className="  px-4 py-2 rounded mt-2 "
          onClick={addTask}
        >
          Add Task
        </button>
      </div>
      <ul className="list-disc pl-5">{renderTasks()}</ul>
      {updateTask.id && (
        <div className="mt-4">
          <input
            type="text"
            value={updateTask.text}
            onChange={(e) => setUpdateTask({ ...updateTask, text: e.target.value })}
            placeholder="Update task"
            className="border rounded p-2 w-full"
          />
          <button
            className="  px-4 py-2 rounded mt-2 "
            onClick={() => editTask(updateTask.id)}
          >
            Update Task
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
