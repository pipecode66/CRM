import { getTaskBoard } from "@/lib/crm/queries";

export default async function TasksPage() {
  const tasks = await getTaskBoard();

  return (
    <section className="space-y-4">
      <header>
        <h2 className="text-2xl font-black tracking-tight text-slate-900">Tareas y seguimiento</h2>
        <p className="text-sm text-slate-500">Llamar, cotizar, confirmar pago y seguimiento postventa por prioridad.</p>
      </header>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-4 py-3">Tarea</th>
              <th className="px-4 py-3">Lead</th>
              <th className="px-4 py-3">Asignado</th>
              <th className="px-4 py-3">Prioridad</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Vence</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.id} className="border-t border-slate-100">
                <td className="px-4 py-3 text-slate-800">{task.title}</td>
                <td className="px-4 py-3 text-slate-600">{task.lead?.fullName ?? "-"}</td>
                <td className="px-4 py-3 text-slate-600">{task.assignedTo?.name ?? "-"}</td>
                <td className="px-4 py-3 text-slate-600">{task.priority}</td>
                <td className="px-4 py-3 text-slate-600">{task.status}</td>
                <td className="px-4 py-3 text-slate-600">{task.dueAt ? task.dueAt.toLocaleString() : "-"}</td>
              </tr>
            ))}
            {tasks.length === 0 ? (
              <tr>
                <td className="px-4 py-5 text-center text-slate-400" colSpan={6}>
                  No hay tareas registradas
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
